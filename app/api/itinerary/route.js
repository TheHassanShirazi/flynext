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
            where: { id: decoded.id },
        });

        return NextResponse.json(itineraries, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}