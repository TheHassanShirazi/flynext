import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { roomTypeId } = await params;
    console.log("fucking hell");

    try {
        const roomType = await prisma.roomType.findUnique({
            where: {
                id: parseInt(roomTypeId)
            },
            include: { images: true },
        });

        if (!roomType) {
            return NextResponse.json({ error: 'Room Type not found' }, { status: 404 });
        }

        return NextResponse.json(roomType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}