import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { v4 } from "uuid";             
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";      
import { join } from "path";
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
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        
        // Create uploads directory if it doesn't exist
        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = join(uploadsDir, fileName);
        
        // Write file to disk
        writeFileSync(filePath, fileStream);

        // Find existing profile picture
        const existingPfp = await prisma.profilePicture.findUnique({
            where: {
                userId: parseInt(decoded.id)
            }
        });

        let updatedUser;

        if (existingPfp) {
            // Delete old file
            try {
                const oldFilePath = join(uploadsDir, existingPfp.fileName);
                if (existsSync(oldFilePath)) {
                    unlinkSync(oldFilePath);
                }
            } catch (error) {
                console.error('Error deleting old profile picture:', error);
            }

            // Update existing profile picture record
            updatedUser = await prisma.user.update({
                where: { id: parseInt(decoded.id) },
                data: {
                    profilePic: {
                        update: {
                            fileName: fileName
                        }
                    }
                },
                include: {
                    profilePic: true
                }
            });
        } else {
            // Create new profile picture record
            updatedUser = await prisma.user.update({
                where: { id: parseInt(decoded.id) },
                data: {
                    profilePic: {
                        create: {
                            fileName: fileName
                        }
                    }
                },
                include: {
                    profilePic: true
                }
            });
        }
          
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}