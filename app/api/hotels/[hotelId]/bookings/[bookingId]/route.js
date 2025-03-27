import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);  

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
            });

        const { hotelId, bookingId } = await params;
        
        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        if (hotel.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized - only the owner of this hotel has access' }, { status: 401 });
        }

        const booking = await prisma.booking.delete({
            where: { id: parseInt(bookingId) },
        });

        await prisma.notification.create({
            data: {
                message: `Booking ${bookingId} has been deleted`,
                userId: user.id,
            },
        });

        return NextResponse.json({ booking }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}