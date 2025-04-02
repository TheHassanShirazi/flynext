import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request) {

    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const itineraries = await prisma.itinerary.findMany({
            where: { userId: decoded.id },
        });

        return NextResponse.json(itineraries, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}


export async function POST(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Itinerary name is required' }, { status: 400 });
        }

        // Create a new itinerary
        const newItinerary = await prisma.itinerary.create({
            data: {
                name: name,
                userId: decoded.id,
            },
        });

        return NextResponse.json(newItinerary, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
