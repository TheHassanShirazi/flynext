'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import HotelSearchBar from '@/components/hotel-searchbar';

export default function HotelSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotels, setHotels] = useState(null); // Default to null
  const [loading, setLoading] = useState(true);
  const [expandedHotel, setExpandedHotel] = useState(null);

  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Get search parameters
        const city = searchParams.get('city') || '';
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
        if (checkInDate) params.set('checkInDate', checkInDate);
        if (checkOutDate) params.set('checkOutDate', checkOutDate);

        console.log(params.toString());

        const response = await fetch(`http://localhost:3000/api/hotels/search?${params.toString()}`);
        const data = await response.json();
        console.log('Fetched data:', data);

        setHotels(data); // Set fetched data to hotels
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels(null); // In case of error, set hotels to an empty array
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchHotels();
  }, [searchParams]);

  // Log the value of hotels when it changes
  useEffect(() => {
    console.log('Updated hotels:', hotels);
  }, [hotels]); // This will log when hotels is updated

  const toggleRoomList = (hotelId) => {
    setExpandedHotel(expandedHotel === hotelId ? null : hotelId);
  };

  const handleBookRoom = (hotelId, roomId) => {
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    console.log(`Booking room ${roomId} in hotel ${hotelId} from ${checkIn} to ${checkOut}`);
    // Redirect to booking page with parameters
    router.push(`/book/hotel?hotelId=${hotelId}&roomTypeId=${roomId}&checkInDate=${checkIn}&checkOutDate=${checkOut}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <HotelSearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {hotels?.length || 0} properties {/* Show count or 0 if hotels is null */}
          </h1>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">Loading hotels...</div>
        ) : hotels === null || hotels.length === 0 ? (
          <div className="flex justify-center items-center h-screen text-gray-500">Hotels could not be searched.</div>
        ) : hotels instanceof Object ? (
              hotels.availableHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div key={hotel.id} className="p-6">
                    <div key={hotel.id} className="flex gap-6">
                      {/* Hotel Image */}
                      <div key={hotel.id} className="w-72 h-48 relative rounded-lg overflow-hidden">
                        {hotel.images && (
                        <Image
                          key={hotel.id}
                          src={`/images/${hotel.images[0]?.fileName || 'default-hotel'}.jpg`}
                          alt={hotel.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      
                        )}
                      </div>
                      {/* Hotel Details */}
                      <div key={hotel.id} className="flex-1">
                        <div key={hotel.id} className="flex justify-between items-start">
                          <div key={hotel.id}>
                            <h2
                              key={hotel.id}
                              onClick={() => router.push(`/hotels/${hotel.id}`)}
                              className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                            >
                              {hotel.name}
                            </h2>
                            <p key={hotel.id} className="text-base text-gray-700 mb-2 font-medium">{hotel.address}</p>
                            <div key={hotel.id} className="flex items-center gap-3 mb-4">
                              <span key={hotel.id} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-base font-semibold">
                                {hotel.starRating}/10
                              </span>
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div key={hotel.id} className="text-right">
                            <p key={hotel.id} className="text-sm font-medium text-gray-500 mb-1">Starting from</p>
                            <p key={hotel.id} className="text-3xl font-bold text-blue-600 mb-3">
                              ${Math.min(...hotel.roomTypes.map((room) => room.pricePerNight))}
                            </p>
                            <button
                              key={hotel.id}
                              onClick={() => toggleRoomList(HTMLOptionElement.id)}
                              className="px-6 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {expandedHotel === hotel.id ? 'Hide Rooms' : 'See Available Rooms'}
                            </button>
                          </div>
                        </div>

                        {/* Room List */}
                        {expandedHotel === hotel.id && (
                          <div key={hotel.id} className="mt-6 border-t pt-6">
                            <div key={hotel.id} className="space-y-4">
                              {hotel.roomTypes.map(room => (
                                <div
                                  key={room.id}
                                  className="flex justify-between items-center p-5 bg-gray-50 rounded-lg"
                                >
                                  <div key={room.id}>
                                    <h3 key={room.id} className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
                                    <p key={room.id} className="text-base text-gray-600">{room.amenities}</p>
                                  </div>
                                  <div key={room.id} className="text-right">
                                    <p key={room.id} className="text-2xl font-bold text-blue-600 mb-3">
                                      ${room.pricePerNight}
                                    </p>
                                    <button
                                      key={room.id}
                                      onClick={() => handleBookRoom(hotel.id, room.id)}
                                      className={`px-6 py-2.5 rounded-lg text-base font-semibold ${room.availableRooms ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
                                      disabled={!room.availableRooms}
                                    >
                                      {room.availableRooms ? 'Book Now' : 'Not Available'}
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
              ))
            ) : (
              <div className="text-center text-gray-500">No hotels available for the selected filters.</div>
            )}
          </div>
      </div>
  );
}
