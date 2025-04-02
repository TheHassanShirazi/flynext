// verify the booking with id bookingId by making sure the flight is on schedule (using AFS). if so, change verificationStatus to 'verified'

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

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

        if (booking.verificationStatus === 'verified') {
            return NextResponse.json({ error: 'Booking already verified' }, { status: 400 });
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
                verificationStatus: 'verified',
            }
        });

        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}