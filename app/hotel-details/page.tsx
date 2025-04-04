'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Image {
    id: number;
    url: string;
    hotelId: number;
}

interface Logo {
    id: number;
    url: string;
    hotelId: number;
}

interface RoomType {
    id: number;
    name: string;
    description: string;
    price: number;
    hotelId: number;
}

interface Booking {
    id: number;
    startDate: Date;
    endDate: Date;
    userId: number;
    hotelId: number;
    roomTypeId: number;
}

interface Hotel {
    id: number;
    name: string;
    description: string;
    address: string;
    images: Image[];
    logo: Logo;
    roomTypes: RoomType[];
    bookings: Booking[];
}

export default function HotelDetailsPage() {
    const params = useParams();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/hotels/${params.hotelId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Hotel = await response.json();
                setHotel(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to fetch hotel details.');
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [params.hotelId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!hotel) {
        return <p>Hotel not found.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>

            {hotel.logo && (
                <div className="mb-4">
                    <Image src={hotel.logo.url} alt={`${hotel.name} Logo`} className="max-w-xs" />
                </div>
            )}

            <p className="mb-4">{hotel.description}</p>
            <p className="mb-4">Address: {hotel.address}</p>

            {hotel.images && hotel.images.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Images</h2>
                    <div className="flex flex-wrap gap-4">
                        {hotel.images.map((image) => (
                            <Image key={image.id} src={image.url} alt={`Hotel Image ${image.id}`} className="max-w-xs" />
                        ))}
                    </div>
                </div>
            )}

            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Room Types</h2>
                    <ul>
                        {hotel.roomTypes.map((room) => (
                            <li key={room.id} className="border p-2 mb-2">
                                <h3 className="font-semibold">{room.name}</h3>
                                <p>{room.description}</p>
                                <p>Price: ${room.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hotel.bookings && hotel.bookings.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Bookings</h2>
                    <ul>
                        {hotel.bookings.map((booking) => (
                            <li key={booking.id} className="border p-2 mb-2">
                                <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                                <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                                <p>Room Type ID: {booking.roomTypeId}</p>
                                <p>User ID: {booking.userId}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}