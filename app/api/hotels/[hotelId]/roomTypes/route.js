import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request, { params }) {

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

        const { type, totalRooms, amenities, pricePerNight } = await request.json();

        if (type === undefined || totalRooms === undefined || amenities === undefined || pricePerNight === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const roomType = await prisma.roomType.create({
            data: {
                hotelId: parseInt(hotelId),
                type: type,
                totalRooms: parseInt(totalRooms),
                amenities: amenities,
                pricePerNight: parseFloat(pricePerNight),
                images: {},
                bookings: {}
            }
        });

        await prisma.hotel.update({
            where: { id: parseInt(hotelId) },
            data: {
                roomTypes: {
                    connect: { id: parseInt(roomType.id) }
                }
            }
        });
            
        return NextResponse.json(roomType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}