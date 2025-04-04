'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import HotelSearchBar from '@/components/hotel-searchbar';

interface Hotel {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  city: string;
  images: {
    id: number;
    fileName: string;
    hotelId: number;
    roomTypeId: number;
  }[];
  starRating: number;
  roomTypes: {
    id: string;
    name: string;
    amenities: string;
    pricePerNight: number;
    availableRooms: boolean;
  }[];
}

export default function HotelSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);

  // Mock data for testing - replace with actual API call
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Get search parameters
        const city = searchParams.get('searchQuery') || '';
        const rating = searchParams.get('rating');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const checkInDate = searchParams.get('checkInDate') || '';
        const checkOutDate = searchParams.get('checkOutDate') || '';

        // Build the API URL with filters
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (rating) params.set('rating', rating);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        // This will be replaced with actual API endpoint
        const response = await fetch(`http://localhost:3000/api/hotels/search?${params.toString()}`);
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, [searchParams]);

  const toggleRoomList = (hotelId: string) => {
    setExpandedHotel(expandedHotel === hotelId ? null : hotelId);
  };

  const handleBookRoom = (hotelId: string, roomId: string) => {
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    console.log(`Booking room ${roomId} in hotel ${hotelId} from ${checkIn} to ${checkOut}`);
    // Redirect to booking page with parameters
    router.push(`/book/hotel?hotelId=${hotelId}&roomTypeId=${roomId}&checkInDate=${checkIn}&checkOutDate=${checkOut}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <Navbar />
      <div className="pt-20 pb-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <HotelSearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {hotels.length}+ properties
          </h1>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Hotel List */}
        <div className="grid gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Hotel Image */}
                  <div className="w-72 h-48 relative rounded-lg overflow-hidden">
                    <Image
                      src={`/images/${hotel.images[0]?.fileName || 'default-hotel'}.jpg`}
                      alt={hotel.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2
                          onClick={() => router.push(`/hotels/${hotel.id}`)}
                          className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                        >
                          {hotel.name}
                        </h2>
                        <p className="text-base text-gray-700 mb-2 font-medium">{hotel.address}</p>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-base font-semibold">
                            {hotel.rating}/10
                          </span>
                          <span className="text-gray-700 font-medium">
                            {hotel.reviews} reviews
                          </span>
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed">{hotel.description}</p>
                      </div>

                      {/* Price and CTA */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">Starting from</p>
                        <p className="text-3xl font-bold text-blue-600 mb-3">
                          ${Math.min(...hotel.roomTypes.map((room) => room.price))}
                        </p>
                        <button
                          onClick={() => toggleRoomList(hotel.id)}
                          className="px-6 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {expandedHotel === hotel.id ? 'Hide Rooms' : 'See Available Rooms'}
                        </button>
                      </div>
                    </div>

                    {/* Room List */}
                    {expandedHotel === hotel.id && (
                      <div className="mt-6 border-t pt-6">
                        <div className="space-y-4">
                          {hotel.roomTypes.map((room) => (
                            <div
                              key={room.id}
                              className="flex justify-between items-center p-5 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
                                <p className="text-base text-gray-600">{room.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600 mb-3">
                                  ${room.price}
                                </p>
                                <button
                                  onClick={() => handleBookRoom(hotel.id, room.id)}
                                  className={`px-6 py-2.5 rounded-lg text-base font-semibold ${
                                    room.available
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  } transition-colors`}
                                  disabled={!room.available}
                                >
                                  {room.available ? 'Book Now' : 'Not Available'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </Suspense>
    </div>
  );
}
