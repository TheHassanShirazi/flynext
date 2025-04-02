import { NextResponse } from 'next/server';

// This is a mock database for testing purposes
const mockHotel = {
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
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // For now, return mock data
  // In a real application, you would fetch this from a database
  return NextResponse.json(mockHotel);
}
