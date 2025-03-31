import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { hotelId } = await params;

    const bookings = await prisma.booking.findMany({
        where: { hotelId: parseInt(hotelId) },
    });

    return NextResponse.json({ bookings }, { status: 200 });
}