import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { generateToken, verifyRefreshToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(request) {
    const { refreshToken } = await request.json();

    try {
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
        }

        const newAccessToken = generateToken({ email: user.email, id: user.id });

        return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}