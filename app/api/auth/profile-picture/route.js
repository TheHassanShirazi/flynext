import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { v4 } from "uuid";             
import { writeFileSync } from "fs";      
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);
        const formData = await request.formData(); // Get form data from request
        const imageFile = formData.get('image'); // extract image file

        // Return error if NO IMAGE provided
        if (imageFile === null) {
            return NextResponse.json({ error: 'No image file found' }, { status: 400 });
        }

        console.log("form data", formData);

        const file = await imageFile.arrayBuffer();
        const fileStream = Buffer.from(file);

        const fileName = `${v4()}.jpg`;

        const filePath = `./public/uploads/${fileName}`;
        
        // Write file to disk
        writeFileSync(filePath, fileStream);

        // Create new profile pic record in database
        const pfp = await prisma.profilePicture.create({
            data: {
                userId: parseInt(decoded.id),  // Associate with user
                fileName: fileName,            // Store generated filename
            },
        });

        // Update user record to connect with new profile picture
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(decoded.id) },
            data: {
              profilePic: {
                connect: { id: pfp.id },     // Connect to new profile picture
              },
            },
            include: {
              profilePic: true,              // Include profile picture in response
            },
          });
          
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}