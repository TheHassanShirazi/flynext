// POST request with new settings for dark mode ("on" or "off") and notification settings

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function PUT(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { darkMode } = await request.json();

    if (darkMode !== 'on' && darkMode !== 'off') {
        return NextResponse.json({ error: 'Invalid dark mode setting' }, { status: 400 });
    }

    try {
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(decoded.id) },
            data: {
                darkMode: darkMode,
            },
        });

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 });
    }
}