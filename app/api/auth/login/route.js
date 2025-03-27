import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { generateRefreshToken, generateToken } from '@/utils/auth';
import { comparePassword } from '@/utils/auth'; 

const prisma = new PrismaClient();

export async function POST(request) {
  // Extract login credentials from request body
  const { email, password } = await request.json();

  try {
    // Find user by email in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return error if user doesn't exist
    if (!user) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
    }

    // Verify password matches stored hash
    const isPasswordValid = comparePassword(password, user.password);

    // Return error if password is invalid
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
    }

    // Generate JWT access token
    const accessToken = generateToken({ email: user.email, id: user.id });

    // Generate refresh token for token renewal
    const refreshToken = generateRefreshToken({ email, id: user.id});

    // Return both tokens on successful login
    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}