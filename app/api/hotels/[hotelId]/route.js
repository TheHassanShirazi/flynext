import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { hotelId } = await params;
    const hotel = await prisma.hotel.findUnique({
        where: { id: parseInt(hotelId) },
        include: {
            images: true,
            logo: true,
            roomTypes: true,
            bookings: true
        }
    });

    return NextResponse.json(hotel, { status: 200 });
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

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        if (hotel.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized - only the owner of this hotel has access' }, { status: 401 });
        }

        const { name, address, city, starRating } = await request.json();

        if (name === undefined && address === undefined && city === undefined && starRating === undefined && logoId === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let data = {};

        if (name) data.name = name;
        if (address) data.address = address;
        if (city) data.location = city;
        if (starRating) data.starRating = parseInt(starRating);
        
        const updatedHotel = await prisma.hotel.update({
            where: { id: parseInt(hotelId) },
            data: data
        });
        
        return NextResponse.json(updatedHotel, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}