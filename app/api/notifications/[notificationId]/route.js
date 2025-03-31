import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const { notificationId } = await params;

    const notification = await prisma.notification.update({
        where: { id: parseInt(notificationId) },
        data: { read: true },
    });

    if (!notification) {
        return NextResponse.json({ error: 'Notification does not exist' }, { status: 400 })
    }

    return NextResponse.json(notification, { status: 200 });
}