import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    const { hotelId } = await params;
    console.log(hotelId);

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        if (hotel.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized - only the owner of this hotel has access' }, { status: 401 });
        }

        const { type, totalRooms, amenities, pricePerNight } = await request.json();

        if (type === undefined || totalRooms === undefined || amenities === undefined || pricePerNight === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const roomType = await prisma.roomType.create({
            data: {
                hotelId: parseInt(hotelId),
                type: type,
                totalRooms: parseInt(totalRooms),
                amenities: amenities,
                pricePerNight: parseFloat(pricePerNight),
                images: {},
                bookings: {}
            }
        });

        await prisma.hotel.update({
            where: { id: parseInt(hotelId) },
            data: {
                roomTypes: {
                    connect: { id: parseInt(roomType.id) }
                }
            }
        });
            
        return NextResponse.json(roomType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}

export async function GET(request, { params }) {

    try {

        const { hotelId } = await params;  // Get hotelId from params

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        // Fetch all room types associated with the hotel
        const roomTypes = await prisma.roomType.findMany({
            where: { hotelId: parseInt(hotelId) },
        });

        if (roomTypes.length === 0) {
            return NextResponse.json({ message: 'No room types available for this hotel.' }, { status: 200 });
        }
        console.log(roomTypes);
        return NextResponse.json(roomTypes, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching room types.' }, { status: 500 });
    }
}

