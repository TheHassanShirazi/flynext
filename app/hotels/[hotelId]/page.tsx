"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchbar";

interface RoomType {
  id: string;
  name: string;
  description: string;
  squareFeet: number;
  sleeps: number;
  bedType: string;
  amenities: string[];
  price: number;
  images: { fileName: string }[];
  available: boolean;
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  images: { fileName: string }[];
  rating: number;
  reviews: number;
  highlights: string[];
  roomTypes: RoomType[];
}

export default function HotelDetails() {
  const params = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`/api/hotel/${params.hotelId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Response was not JSON");
        }

        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        // You might want to set an error state here to show to the user
      }
    };

    if (params.hotelId) {
      fetchHotelDetails();
    }
  }, [params.hotelId]);

  if (!hotel) {
    return (
      <div>
        <Navbar />
        <div className="mt-20 p-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <SearchBar />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-900 font-bold mb-4">{hotel.name}</h1>
        <p className="text-gray-600 mb-6">{hotel.address}</p>

        {/* Image Carousel */}
        <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
          {hotel.images && hotel.images.length > 0 && (
            <>
              <Image
                src={`/uploads/${hotel.images[activeImageIndex].fileName}.jpg`}
                alt={`${hotel.name} - Image ${activeImageIndex + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : hotel.images.length - 1))}
              >
                ←
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                onClick={() => setActiveImageIndex((prev) => (prev < hotel.images.length - 1 ? prev + 1 : 0))}
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="bg-green-100 inline-block px-3 py-1 rounded-lg mb-6">
          <span className="font-bold text-gray-900">{hotel.rating}</span>
          <span className="text-gray-900"> · {hotel.reviews} Reviews</span>
        </div>

        {/* Room Types */}
        <div className="grid gap-6">
          {hotel.roomTypes.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl text-gray-900 font-semibold mb-2">{room.name}</h3>
                  <div className="space-y-2 text-gray-900">
                    <p className="flex items-center gap-2">
                      <span>📏 {room.squareFeet} sq ft</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>👥 Sleeps {room.sleeps}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🛏️ {room.bedType}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📶 Free WiFi</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${room.price}</p>
                  <p className="text-gray-500 text-sm">per night</p>
                  <Link
                    href={`/hotels/book/${hotel.id}/${room.id}`}
                    className={`mt-4 inline-block px-6 py-2 rounded-lg ${
                      room.available
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {room.available ? "Reserve" : "Fully Booked"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
