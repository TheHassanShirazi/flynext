import { NextResponse } from 'next/server';

export async function GET(request) {
    // Extract query parameters using searchParams
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");

    // Validate required parameters
    if (!origin || !destination || !date) {
        return NextResponse.json({ error: "Origin, destination, and date are required" }, { status: 400 });
    }

    try {
        // Fetch flights from the external API
        const response = await fetch(
            `https://advanced-flights-system.replit.app/api/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`,
            {
                method: "GET",
                headers: {
                    "x-api-key": "912bca97746f0a137ef29f6a66e6c4c9dc746a8a11ce4cd05741872e42916954",
                },
            }
        );

        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || "Failed to fetch flights" }, { status: response.status });
        }

        // Return the flight data
        const data = await response.json();
        return NextResponse.json({ flights: data }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

