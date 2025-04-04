import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    const checkInDate = new Date(params.get('checkInDate'));     // Check-in date
    const checkOutDate = new Date(params.get('checkOutDate'));   // Check-out date
    const city = params.get('city');                             // City location
    const name = params.get('name');                             // Hotel name
    const starRating = parseInt(params.get('starRating'));       // Star rating
    const minPrice = parseInt(params.get('minPrice'));           // Minimum price
    const maxPrice = parseInt(params.get('maxPrice'));           // Maximum price

    console.log('Check-in date:', checkInDate);
    console.log('Check-out date:', checkOutDate);
    console.log('City:', city);

    // Validate required fields are present
    if (checkInDate === undefined || checkOutDate === undefined || city === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Validate check-in date (before check-out date)
    if (checkInDate > checkOutDate) {
        return NextResponse.json({ error: 'Check-in date must be before check-out date' }, { status: 400 });
    }
    if (minPrice > maxPrice) {
        return NextResponse.json({ error: 'Minimum price must be less or equal to maximum price' }, { status: 400 });
    }
    let hotelFilters = {
        city: city    // Required city filter
    }

    // ADD FILTERS
    if (name) {
        hotelFilters.name = name;
    }
    if (starRating) {
        hotelFilters.starRating = starRating;
    }

    const hotels = await prisma.hotel.findMany({
        where: hotelFilters,
        include: {
            roomTypes: true,
            images: true
        }
    });

    console.log('Hotels that match the search:', hotels);

    const availableHotels = [];

    for (const hotel of hotels) {
        const bookings = await prisma.booking.findMany({
            where: {
                hotelId: hotel.id,
                checkInDate: { lte: checkOutDate },
                checkOutDate: { gte: checkInDate },
            }
        });

        console.log('Bookings:', bookings);
        console.log('At hotel:', hotel);
    
        let availableRoomTypes = hotel.roomTypes.filter(roomType => {
            const bookedRooms = bookings.filter(booking => booking.roomTypeId === roomType.id).length;
            return bookedRooms < roomType.totalRooms;
        })
        if (maxPrice) {
            availableRoomTypes = availableRoomTypes.filter(roomType => roomType.pricePerNight <= maxPrice);
        }
        if (minPrice) {
            availableRoomTypes = availableRoomTypes.filter(roomType => roomType.pricePerNight >= minPrice);
        }

        const justHotel = await prisma.hotel.findUnique({
            where: { id: parseInt(hotel.id) },
            include: {
                images: true
            }
        });
    
        if (availableRoomTypes.length > 0) {
            availableHotels.push({
                hotel: justHotel,
                roomTypes: availableRoomTypes
            });
        }
    }
    
    console.log(availableHotels);
    return NextResponse.json({ availableHotels }, { status: 200 });
}