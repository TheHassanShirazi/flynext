import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  // Extract user details from request body
  const { password, firstName, lastName, email, location, phoneNumber } = await request.json();

  try {
    // Check if user with email already exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return error if email is already registered
    if (user) {
      return NextResponse.json({ error: 'email already exists' }, { status: 400 });
    }

    // Hash the user's password before storing
    const hashedPassword = await hashPassword(password);
    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        password: hashedPassword,      // Store hashed password
        firstName,                    // User's first name
        lastName,                     // User's last name
        location,                     // User's location
        email,                        // User's email
        phoneNumber: phoneNumber || null,  // Optional phone number
        hotels: {}                    // Initialize empty hotels relation
      }
    });
    return NextResponse.json({ user: newUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}