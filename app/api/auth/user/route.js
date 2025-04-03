import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request) {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1];

    try {
        const decoded = verifyToken(accessToken);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(decoded.id)
            },
            include: { profilePic: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}