import { verifyToken, verifyRefreshToken, invalidateToken } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Access the headers directly
        const accessToken = request.headers.get('Authorization')?.split(' ')[1];
        const refreshToken = request.headers.get('Authorization')?.split(' ')[2];

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        console.log(request.headers.get('Authorization'));

    // if (!accessToken || !refreshToken) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     //}


        // Now proceed with verifying and invalidating the tokens
        const accessTokenPayload = verifyToken(accessToken);
        const refreshTokenPayload = verifyRefreshToken(refreshToken);

        if (!accessTokenPayload || !refreshTokenPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await invalidateToken(accessToken);
        await invalidateToken(refreshToken);

        return NextResponse.json({ message: 'Successfully logged out' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}