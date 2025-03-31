import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    // Return error if no token is provided
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const { name, address, city, starRating } = await request.json();   // extrack

        console.log(name, address, city, starRating);

        // Validate that all required fields are provided
        if (name === undefined || address === undefined || city === undefined || starRating === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create new hotel in database with provided details
        const hotel = await prisma.hotel.create({
            data: {
                ownerId: decoded.id,      // Set owner to current authenticated user
                name: name,               // Hotel name
                address: address,         // Hotel address
                city: city,               // Hotel city
                starRating: parseInt(starRating),  // Convert starRating to integer
                images: {},               // Initialize empty images relation
                roomTypes: {},            // Initialize empty roomTypes relation
                bookings: {}              // Initialize empty bookings relation
            },
        });

        return NextResponse.json(hotel, {status: 200});
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}