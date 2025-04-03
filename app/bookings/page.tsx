'use client'

import Navbar from '@/components/navbar';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0800'
    },
    secondary: {
      main: '#0077b6'
    }
  },
});

export default function Itineraries() {

  function Flight({ itinerary, index, handleCancelFlight }) {
    if (itinerary.bookings[index] !== undefined) {
      return (
        <Box sx={{ display: 'flex', maxHeight: '20rem', minWidth: '30rem', flexDirection:'column' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {itinerary.bookings[index].flightFrom} to {itinerary.bookings[index].flightTo}
          </h2>
          <p className="text-base text-gray-700 mb-2">Departing: {itinerary.bookings[index].departureTime}</p>
          <p className="text-base text-gray-700 mb-2">Arriving: {itinerary.bookings[index].arrivalTime}</p>
          <div className="mt-4">
            <ThemeProvider theme={theme}>
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '10rem', marginY:'5.35rem' }}>
                <Button onClick={() => handleCancelFlight(itinerary.id)} color="primary" variant="contained">
                  Cancel Flight
                </Button>
              </Box>
            </ThemeProvider>
          </div>
        </Box>
      );
    } else {
      return <></>;
    }
  }

  async function fetchHotelData(hotelId) {
    const hotelResponse = await fetch(`http://localhost:3000/api/hotels/${hotelId}`);
    const hotelData = await hotelResponse.json();
    return hotelData;
  }

  async function fetchRoomTypeData(hotelId, roomTypeId) {
    const hotelResponse = await fetch(`http://localhost:3000/api/hotels/${hotelId}/roomTypes/${roomTypeId}`);
    const hotelData = await hotelResponse.json();
    return hotelData;
  }

  function Hotel({ itinerary, index, handleCancelHotel }) {
    const [hotel, setHotel] = useState(null);
    const [roomType, setRoomType] = useState(null);

    useEffect(() => {
      if (itinerary.bookings[index]) {
        const hotelId = itinerary.bookings[index].hotelId;
        const roomTypeId = itinerary.bookings[index].roomTypeId;

        const fetchData = async () => {
          const fetchedHotel = await fetchHotelData(hotelId);
          const fetchedRoomType = await fetchRoomTypeData(hotelId, roomTypeId);

          setHotel(fetchedHotel);
          setRoomType(fetchedRoomType);
        };

        fetchData();
      }
    }, [itinerary, index]);

    if (!hotel || !roomType) {
      return <p>Loading...</p>;
    }

    return (
      <Box sx={{ display: 'flex', maxHeight: '20rem', flexDirection:'column' }}>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
          <p className="text-base text-gray-700 mb-2">{hotel.address}</p>
          <p className="text-base text-gray-600 mb-4">Price: ${roomType.pricePerNight} nightly</p>
        </div>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button onClick={() => handleCancelHotel(itinerary.id)} color="primary" variant="contained" sx={{ marginBottom: '5rem' }}>
              Cancel Hotel Booking
            </Button>
          </Box>
        </ThemeProvider>
        <div className="mt-4">
          {cancels.hotelBookings.includes(itinerary.id) && (
            <div className="text-red-500 font-semibold">
              This reservation has been cancelled.
            </div>
          )}
          {cancels.flights.includes(itinerary.id) && (
            <div className="text-red-500 font-semibold">
              This flight has been cancelled.
            </div>
          )}
        </div>
      </Box>
    );
  }

  const [itineraries, setItineraries] = useState(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);
      if (accessToken) setSignedIn(true);
      const itinerariesResponse = await fetch(`http://localhost:3000/api/itineraries`, {
        method: 'GET',
        headers: {
          'Authorization': 'lol ' + accessToken
        }
      });
      const itinerariesData = await itinerariesResponse.json();
      setItineraries(itinerariesData);
    };
    fetchData();
  }, []);

  const [cancels, setCancels] = useState({
    flights: [], // for tracking cancelled flights
    hotelBookings: [], // for tracking cancelled hotel bookings
    itineraries: [] // for tracking cancelled itineraries
  });

  const handleCancelFlight = async (itineraryId) => {
    const itinerary = itineraries.filter(itinerary => itinerary.id === itineraryId)[0];
    const bookingId = itinerary.bookings.filter(booking => booking.departureTime)[0].id;
    const deleteResponse = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    console.log(await deleteResponse.json());

    setCancels((prev) => ({
      ...prev,
      flights: [...prev.flights, itineraryId]
    }));
  };

  const handleCancelHotel = async (itineraryId) => {
    const itinerary = itineraries.filter(itinerary => itinerary.id === itineraryId)[0];
    const bookingId = itinerary.bookings.filter(booking => booking.checkInDate)[0].id;
    const deleteResponse = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    console.log(await deleteResponse.json());

    setCancels((prev) => ({
      ...prev,
      hotelBookings: [...prev.hotelBookings, itineraryId]
    }));
  };

  const handleCancelItinerary = async (itineraryId) => {
    const itinerary = itineraries.filter((itinerary) => itinerary.id === itineraryId)[0];
  
    // Sequential async operation
    for (const booking of itinerary.bookings) {
      const deleteResponse = await fetch(`http://localhost:3000/api/bookings/${booking.id}`, {
        method: 'DELETE',
      });
      console.log(deleteResponse);
    }
  
    setCancels((prev) => ({
      flights: [...prev.flights, itineraryId],
      hotelBookings: [...prev.hotelBookings, itineraryId],
      itineraries: [...prev.itineraries, itineraryId],
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-8 bg-white shadow-sm">
        <div className="container mx-auto px-4"></div>
      </div>

      {signedIn &&
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h2">My Bookings</Typography>
        </div>

        {/* Itinerary List */}
        <div className="grid gap-6">
          {itineraries && itineraries.length > 0 && itineraries.map((itinerary) => (
            <>
              <Typography variant="h4" sx={{ fontWeight: '500' }}>{itinerary.name}</Typography>
              <div
                key={itinerary.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                  cancels.itineraries.includes(itinerary.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Flight Details */}
                    {
                      itinerary.bookings.length > 0 && (itinerary.bookings[0].departureTime || (itinerary.bookings.length > 1 && itinerary.bookings[1].departureTime)) &&
                      <Flight itinerary={itinerary} index={itinerary.bookings[0].departureTime ? 0 : 1} handleCancelFlight={handleCancelFlight} />
                    }

                    {/* Hotel Details */}
                    {
                      itinerary.bookings.length > 0 && (itinerary.bookings[0].checkInDate || (itinerary.bookings.length > 1 && itinerary.bookings[1].checkInDate)) &&
                      <Hotel itinerary={itinerary} index={itinerary.bookings[0].checkInDate ? 0 : 1} handleCancelHotel={handleCancelHotel} />
                    }
                  </div>

                  {/* Cancel Button */}
                  {!cancels.itineraries.includes(itinerary.id) && (
                    <div className="ml-200 mr-0">
                      <Button
                        onClick={async () => {
                          await handleCancelItinerary(itinerary.id);
                        }}
                        disabled={itinerary.bookings.length === 0}
                        color="error"
                        variant="outlined"
                      >
                        Cancel Booking
                      </Button>

                    </div>
                  )}

                  {/* Show Cancelled State */}
                  {cancels.itineraries.includes(itinerary.id) && (
                    <div className="mt-4 text-red-500 font-semibold">
                      This booking has been cancelled.
                    </div>
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      }
      {!signedIn &&
      <div className='flex items-center justify-center'>
        <p className='text-black text-3xl m-5'>Please sign in to see your bookings.</p>
      </div>
      }
    </div>
  );
}
