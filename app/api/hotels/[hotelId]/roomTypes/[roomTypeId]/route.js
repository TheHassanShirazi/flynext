import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {

    try {
        const { roomTypeId } = await params;
        const roomType = await prisma.roomType.findUnique({
            where: {
                id: parseInt(roomTypeId)
            }
        });
        console.log(roomType);
        if (!roomType) {
            return NextResponse.json({ error: "This roomType doesn't exist!" }, { status: 404 });
        }
            
        return NextResponse.json(roomType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}