import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(request) {

    // Get the token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        // Verify the token and decode it
        const decoded = verifyToken(token);  
        // Find the user in the database by the userId
        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
            select: {
                firstName: true,
                lastName: true,
                location: true,
                email: true,
                profilePic: true,
                phoneNumber: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}

export async function PUT(request) {
    // Extract updated profile details from request body
    const { firstName, lastName, phoneNumber, email } = await request.json();

    // Extract JWT token from Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    console.log(token);

    // Return error
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        // Verify the token
        const decoded = verifyToken(token);  

        // Find the user in the database by the userId
        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update specified fields
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(decoded.id) },
            data: {
                firstName,
                lastName,
                phoneNumber,
                email,
            },
        });

        return NextResponse.json({ user: updatedUser }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}

export async function DELETE(request) {
    
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);  

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id: parseInt(decoded.id) },
        });

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}