import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    // Extract booking details from request body
    const { flightId, hotelId, roomTypeId, checkInDate, checkOutDate, departureTime, arrivalTime, destination } = await request.json();
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const data = {
            verificationStatus: 'pending',      // Set initial verification status
            paymentStatus: 'pending',          // Set initial payment status
            userId: decoded.id                // Set user who made the booking
        };
        

        if (checkInDate && checkOutDate) {
            data.checkInDate = new Date(checkInDate);
            data.checkOutDate = new Date(checkOutDate);
        }

        function convertToDateString(datetimeString) {
            const date = new Date(datetimeString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
          }
       
        if (flightId) {
            data.flightId = flightId;
            const flights = await fetch(`https://advanced-flights-system.replit.app/api/flights?origin=${encodeURIComponent(user.location)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(convertToDateString(departureTime))}`,
            {
                method: "GET",
                headers: {
                    "x-api-key": "912bca97746f0a137ef29f6a66e6c4c9dc746a8a11ce4cd05741872e42916954",
                },
            });
            const flightData = await flights.json();
            const flight = flightData.results.filter(f => f.flights.some(l => l.id === flightId))[0];
            data.price = flight.flights[0].price;
            data.flightFrom = user.location;
            data.flightTo = flight.flights[flight.flights.length - 1].destination.city;
            data.departureTime = new Date(departureTime);
            data.arrivalTime = new Date(arrivalTime);

            console.log({
                id: flight.flights[0].id,
                origin: data.flightFrom,
                destination: data.flightTo,
                departureTime: data.departureTime,
                arrivalTime: data.arrivalTime,
                price: data.price,
                legs: flight.legs
            });

            await prisma.flight.create({
                data: {
                    id: flight.flights[0].id,
                    origin: data.flightFrom,
                    destination: data.flightTo,
                    departureTime: data.departureTime,
                    arrivalTime: data.arrivalTime,
                    price: data.price,
                    legs: flight.legs
                }
            })
        }
        if (hotelId) {
            data.hotelId = hotelId;
            const hotel = await prisma.hotel.findUnique({
                where: { id: hotelId },
            });

            if (!hotel) {
                return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
            }
            if (!roomTypeId) {
                return NextResponse.json({ error: 'Room type not submitted' }, { status: 404 });
            }

            const roomType = await prisma.roomType.findUnique({
                where: { id: roomTypeId },
            });

            data.roomTypeId = roomTypeId;
            data.price = roomType.pricePerNight;
        }

        const response = await prisma.booking.create({
            data: data,
        });

        await prisma.notification.create({
            data: {
                userId: decoded.id,
                message: `New booking created with id ${response.id}`,
            },
        });

        if (hotelId) {

            const hotel = await prisma.hotel.findUnique({
                where: { id: hotelId },
            })

            const owner = await prisma.user.findUnique({
                where: { id: hotel.ownerId },
            });

            await prisma.notification.create({
                data: {
                    userId: owner.id,
                    message: `New reservation at hotel ${hotelId} created with id ${response.id}`,
                },
            });
        }
        
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(error.message, { status: 401 });
    }
}

export async function GET(request) {

    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json(bookings, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}