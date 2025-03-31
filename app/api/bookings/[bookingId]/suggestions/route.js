import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { bookingId } = await params; 
    const type = request.nextUrl.searchParams.get('type');
    const hotelId = request.nextUrl.searchParams.get('hotelId');
    const checkInDate = request.nextUrl.searchParams.get('checkInDate');
    // const flightFrom = request.nextUrl.searchParams.get('flightFrom');
    const flightTo = request.nextUrl.searchParams.get('flightTo');

    if (!type) {
        return NextResponse.json({ error: 'Type not provided' }, { status: 400 });
    }

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);  
    const user = await prisma.user.findUnique({
        where: { id: parseInt(decoded.id) },
    });

    const city = flightTo;

    await prisma.booking.findUnique({
        where: { id: parseInt(bookingId) },
    });

    if (type === 'hotel') {

        const flight = await prisma.flight.findUnique({
            where: {
                id: parseInt(flightId),
            }
        });

        if (!flightId) {
            return NextResponse.json({ error: 'Flight not provided' }, { status: 400 });
        }
        if (!flight) {
            return NextResponse.json({ error: 'Flight not found' }, { status: 400 });
        }

        const hotels = await prisma.hotel.findMany({
            where: {
                city,
            }
        });

        return NextResponse.json({ hotels }, { status: 200 });
    }

    if (type === 'flight') {
        const hotel = await prisma.hotel.findUnique({
            where: {
                id: parseInt(hotelId),
            }
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        const flights = await fetch(`https://advanced-flights-system.replit.app/api/flights?origin=${encodeURIComponent(user.location)}&destination=${encodeURIComponent(hotel.city)}&date=${encodeURIComponent(checkInDate)}`,
        {
            method: "GET",
            headers: {
                "x-api-key": "912bca97746f0a137ef29f6a66e6c4c9dc746a8a11ce4cd05741872e42916954",
            },
        });

        const flightData = await flights.json();

        return NextResponse.json(flightData, { status: 200 });
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
}