import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { v4 } from "uuid";
import { writeFileSync } from "fs";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request, { params }) {

    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);  

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });


        const { hotelId, roomTypeId } = await params;

        const hotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }

        if (hotel.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized - only the owner of this hotel has access' }, { status: 401 });
        }

        const formData = await request.formData();
        const imageFile = formData.get('image');

        if (imageFile === null) {
            return NextResponse.json({ error: 'No image file found' }, { status: 400 });
        }

        const file = await imageFile.arrayBuffer();
        const fileStream = Buffer.from(file);
        const fileName = `${v4()}.jpg`;
        const filePath = `./public/uploads/${fileName}`;
        writeFileSync(filePath, fileStream);

        const image = await prisma.image.create({
            data: {
                hotelId: parseInt(hotelId),
                roomTypeId: parseInt(roomTypeId),
                fileName: fileName,
            },
        });

        const roomType = await prisma.roomType.update({
            where: { id: parseInt(roomTypeId) },
            data: {
                images: {
                    connect: { id: parseInt(image.id) }
                }
            },
            include: {
                images: true
            }
        });

        return NextResponse.json(roomType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}