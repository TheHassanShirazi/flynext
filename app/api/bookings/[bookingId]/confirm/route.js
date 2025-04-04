import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {

    try {

        const { bookingId } = await params;
        
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.paymentStatus === 'paid') {
            return NextResponse.json({ error: 'Booking already paid for' }, { status: 200 });
        }

        // MOVE THIS TO VERIFY FLIGHT
        /*
        const flight = await fetch(`https://advanced-flights-system.replit.app/api/flights?origin=${booking.flightFrom}&destination=${booking.flightTo}&date=${booking.departureTime}`);
        const flightData = await flight.json();

        if (flightData.departureTime == booking.departureTime) {
            return NextResponse.json({ error: 'Flight delayed' }, { status: 400 });
        }
            */

        await prisma.booking.update({
            where: { id: parseInt(bookingId) },
            data: {
                paymentStatus: 'verified',
            }
        });

        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}