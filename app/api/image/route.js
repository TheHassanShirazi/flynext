import { NextResponse } from 'next/server';
import fs from 'fs';

export const GET = async (request) => {
    const imageName = request.nextUrl.searchParams.get("name");
    const headers = new Headers(request.headers);
    headers.set('Content-Type', 'image/jpg');
    const filePath = `./public/uploads/${imageName}`;
    try {
        const image = await fs.readFileSync(filePath);
        return new NextResponse(image, { status: 200, headers });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
};