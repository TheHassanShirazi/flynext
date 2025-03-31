import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { flightId } = await params;
        try {
            const flight = await prisma.flight.findUnique({
                where: {
                    id: flightId,
                },
            });

            if (!flight) {
                return res.status(404).json({ error: 'Flight not found' });
            }

            return NextResponse.json(flight);
        } catch (error) {
            return NextResponse.json({ error: error.message}, {status:200});
        }
}