import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
        where: { id: parseInt(bookingId) },
    });

    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });
}

export async function PUT(request, { params }) {

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const { bookingId } = await params;
        const { flight_id, hotel_id } = await request.json();

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.userId !== decoded.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (flight_id && hotel_id) {
            await prisma.booking.delete({
                where: { id: parseInt(bookingId) },
            });

            return NextResponse.json({ message: 'Booking cancelled' }, { status: 200 });
        }

        if (flight_id) {
            const booking = await prisma.booking.update({
                where: { 
                    id: parseInt(bookingId)
                },
                data: {
                    flightId: null,
                    flightFrom: null,
                    flightTo: null,
                    departureTime: null,
                    arrivalTime: null
                },
            });

            return NextResponse.json(booking, { status: 200 });
        }


        if (hotel_id) {
            await prisma.booking.update({
                where: { id: parseInt(bookingId) },
                data: {
                    hotelId: null,
                    roomTypeId: null,
                    checkInDate: null,
                    checkOutDate: null
                }
            });

            return NextResponse.json(booking, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid cancellation request: flight and/or hotel must be cancelled' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}


export async function DELETE(request, { params }) {
    try {

        const { bookingId } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id: parseInt(bookingId) },
        });

        return NextResponse.json({ message: 'Booking successfully cancelled' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}