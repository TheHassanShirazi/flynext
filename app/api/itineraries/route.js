import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request) {

    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const itineraries = await prisma.itinerary.findMany({
            where: {
                userId: parseInt(decoded.id)
            },
            include: {
                bookings: true
            }
        });
        if (!itineraries) {
            return NextResponse.json({ error: "This roomType doesn't exist!" }, { status: 404 });
        }
            
        return NextResponse.json(itineraries, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}


// POST method to add a new itinerary
export async function POST(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const body = await request.json(); // Parse the JSON body from the request
        const { name } = body;

        // Check if the name is provided
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Create a new itinerary
        const newItinerary = await prisma.itinerary.create({
            data: {
                userId: parseInt(decoded.id), // Link itinerary to the user
                name
            }
        });

        return NextResponse.json({ newItinerary }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}