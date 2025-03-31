import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';

    try {
        // Fetch cities from the external API
        const cityResponse = await fetch(
            `https://advanced-flights-system.replit.app/api/cities`,
            {
                method: "GET",
                headers: {
                    "x-api-key": "912bca97746f0a137ef29f6a66e6c4c9dc746a8a11ce4cd05741872e42916954",
                },
            }
        );
        
        const cityJson = await cityResponse.json();
        const cityNames = cityJson.map(city => city.city);

        // Fetch airports from the external API
        const airportResponse = await fetch(
            `https://advanced-flights-system.replit.app/api/airports`,
            {
                method: "GET",
                headers: {
                    "x-api-key": "912bca97746f0a137ef29f6a66e6c4c9dc746a8a11ce4cd05741872e42916954",
                },
            }
        );

        const airportJson = await airportResponse.json();
        const airportNames = airportJson.map(airport => airport.name);

        // Filter results based on the query
        const filteredCities = cityNames.filter(name => name.toLowerCase().includes(query));
        const filteredAirports = airportNames.filter(name => name.toLowerCase().includes(query));
        const combinedResults = [...filteredCities, ...filteredAirports];

        return NextResponse.json({ possible_search : combinedResults }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}