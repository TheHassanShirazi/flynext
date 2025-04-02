import { NextResponse } from 'next/server';

// This is a mock database for testing purposes
const mockHotel = {
  id: "1",
  name: "Grand Hotel Riverside",
  description: "Luxurious hotel with stunning river views",
  address: "123 Riverside Drive, Toronto, ON M5A 1B2",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
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
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
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
