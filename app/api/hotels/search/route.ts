import { NextResponse } from 'next/server';

// Mock data for testing
const mockHotels = [
  {
    id: "1",
    name: "Grand Hotel Riverside",
    description: "Luxurious hotel with stunning river views",
    address: "123 Riverside Drive, Toronto, ON M5A 1B2",
    images: [
      { fileName: "hotel-exterior-1" },
      { fileName: "hotel-exterior-2" }
    ],
    rating: 8.8,
    reviews: 10,
    highlights: ["Spacious", "Quiet"],
    roomTypes: [
      {
        id: "room1",
        name: "Superior Double Room",
        description: "Elegant room with modern amenities",
        squareFeet: 258,
        sleeps: 3,
        bedType: "1 Double Bed",
        amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom"],
        price: 199,
        images: [
          { fileName: "superior-room-1" }
        ],
        available: true
      }
    ]
  },
  {
    id: "2",
    name: "City Center Hotel",
    description: "Modern hotel in the heart of downtown",
    address: "456 Main Street, Toronto, ON M5H 2N2",
    images: [
      { fileName: "hotel-exterior-3" }
    ],
    rating: 9.2,
    reviews: 15,
    highlights: ["Central Location", "Modern"],
    roomTypes: [
      {
        id: "room2",
        name: "Deluxe King Room",
        description: "Spacious room with city views",
        squareFeet: 300,
        sleeps: 2,
        bedType: "1 King Bed",
        amenities: ["Free WiFi", "Mini Bar", "City View"],
        price: 299,
        images: [
          { fileName: "deluxe-room-1" }
        ],
        available: true
      }
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.toLowerCase();
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
  const starRating = searchParams.get('starRating')?.split(',').map(Number);

  // Filter hotels based on search parameters
  let filteredHotels = [...mockHotels];

  if (city) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.address.toLowerCase().includes(city)
    );
  }

  if (minPrice || maxPrice) {
    filteredHotels = filteredHotels.filter(hotel => {
      const minHotelPrice = Math.min(...hotel.roomTypes.map(room => room.price));
      return minHotelPrice >= minPrice && minHotelPrice <= maxPrice;
    });
  }

  if (starRating?.length) {
    filteredHotels = filteredHotels.filter(hotel => 
      starRating.includes(Math.floor(hotel.rating / 2))
    );
  }

  // In a real application, you would:
  // 1. Query a database instead of using mock data
  // 2. Implement proper date filtering for check-in/check-out
  // 3. Add pagination
  // 4. Add more sophisticated filtering and sorting options

  return NextResponse.json(filteredHotels);
}
