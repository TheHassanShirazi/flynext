import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { hotelId } = await params;
    const roomType = request.nextUrl.searchParams.get('roomType');
    const fromDate = request.nextUrl.searchParams.get('fromDate');
    const toDate = request.nextUrl.searchParams.get('toDate');

    const parsedFromDate = fromDate ? new Date(fromDate) : null;
    const parsedToDate = toDate ? new Date(toDate) : null;

    const hotel = await prisma.hotel.findUnique({
        where: { id: parseInt(hotelId) },
        include: {
            roomTypes: true,
        }
    });

    if (!hotel) {
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (roomType && !(hotel.roomTypes.map((roomType) => roomType.type)).includes(roomType)) {
        return NextResponse.json({ error: 'Invalid room type' }, { status: 400 });
    }

    if ((!parsedFromDate && parsedToDate) || (parsedFromDate && !parsedToDate)) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    let dateFilter = [];
    if (parsedFromDate && parsedToDate) {
        dateFilter = {
            checkInDate: { gte: parsedFromDate },
            checkOutDate: { lte: parsedToDate },
        }
    }

    if (parsedFromDate && parsedToDate && (parsedFromDate >= parsedToDate)) {
        return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    const roomTypePrisma = await prisma.roomType.findFirst({
        where: {
            hotelId: parseInt(hotelId),
            type: roomType,
        }
    });

    const bookings = await prisma.booking.findMany({
        where: {
            hotelId: parseInt(hotelId),
            roomTypeId: roomTypePrisma.id,
            ...dateFilter
        }
    });

    const availableRooms = roomTypePrisma.totalRooms - bookings.length;

    return NextResponse.json({ availableRooms }, { status: 200 });
}

export async function PUT(request, { params }) {

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    
    try {
        const decoded = verifyToken(token);  

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });

        
        
        const { hotelId } = await params;
        
        const { roomTypeId, roomsToClear } = await request.json();
        console.log(roomsToClear, roomTypeId);

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
            include: {
                roomTypes: true,
            }
        });

        
        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        
        if (hotel.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized - only the owner of this hotel has access' }, { status: 401 });
        }

        if (roomTypeId && !hotel.roomTypes.map((roomType) => roomType.id).includes(parseInt(roomTypeId))) {
            return NextResponse.json({ error: 'Invalid room type' }, { status: 400 });
        }        

        
        if (!roomTypeId) {
            if (roomsToClear > hotel.roomTypes.reduce((acc, roomType) => acc + roomType.totalRooms)) {
                return NextResponse.json({ error: "You can't clear that many rooms!" }, { status: 400 });
            }
        } else {
            const roomType = await prisma.roomType.findUnique({
                where: {
                    id: parseInt(roomTypeId)
                }
            });
            if (roomsToClear > roomType.totalRooms) {
                return NextResponse.json({ error: "You can't clear that many rooms!" }, { status: 400 });
            }
        }

        let deletedBookings = [];
        

        for (let i = 0; i < roomsToClear; i++) {
            
            let data = {
                hotelId: parseInt(hotelId)
            };

            if (roomTypeId) {
                data.roomTypeId = roomTypeId;
            }
            
            let bookingToDelete = await prisma.booking.findFirst({
                where: data
            });
            
            if (bookingToDelete) {
                
                let deletedBooking;
                if (bookingToDelete.flightId) {
                    deletedBooking = await prisma.booking.update({
                        where: { id: bookingToDelete.id },
                        data: {
                            hotelId: null,
                            roomTypeId: null,
                            checkInDate: null,
                            checkOutDate: null
                        }
                    });
                } else {
                    deletedBooking = await prisma.booking.delete({
                        where: { id: bookingToDelete.id }
                    });
                }
                
                deletedBookings.push(deletedBooking);
                
                await prisma.notification.create({
                    data: {
                        message: `Your reservation for booking ${deletedBooking.id} has been cancelled by the hotel owner`,
                        userId: user.id,
                    }
                })
                
            }
        }
        const numberOfReservationsCleared = deletedBookings.length;

        return NextResponse.json({ numberOfReservationsCleared }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
