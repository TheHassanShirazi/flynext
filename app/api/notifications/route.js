import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

// GET endpoint to retrieve unread notifications for a user
export async function GET(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            console.log("hey");
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        // Fetch all unread notifications for the authenticated user
        const notifications = await prisma.notification.findMany({
            where: {
                userId: decoded.id,    // Filter by user ID
                read: false,           // Only get unread notifications
            },
        });

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
