'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';
import Navbar from '@/components/navbar';

interface Itinerary {
  id: string;
  name: string;
}

export default function FlightBookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const flightId = params.flightId;
  const flightFrom = searchParams.get('flightFrom');
  const flightTo = searchParams.get('flightTo');
  const departureTime = searchParams.get('departureTime');
  const arrivalTime = searchParams.get('arrivalTime');

  const [signedIn, setSignedIn] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState('');
  const [newItineraryName, setNewItineraryName] = useState('');
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      setSignedIn(true);
      try {
        const response = await fetch('http://localhost:3000/api/itineraries', {
          headers: {
            'Authorization': 'lol ' + accessToken
          }
        });
        const data = await response.json();
        setItineraries(data);
        if (data.length > 0) {
          setSelectedItineraryId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchData();
  }, [router]);

  const handleItineraryChange = (event: SelectChangeEvent) => {
    setSelectedItineraryId(event.target.value);
  };

  const handleCreateNewItinerary = async () => {
    if (!newItineraryName.trim()) return;

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:3000/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'lol ' + accessToken
        },
        body: JSON.stringify({ name: newItineraryName })
      });

      if (response.ok) {
        const newItinerary = await response.json();
        setItineraries([...itineraries, newItinerary]);
        setSelectedItineraryId(newItinerary.id);
        setNewItineraryName('');
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedItineraryId) return;

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'lol ' + accessToken
        },
        body: JSON.stringify({
          flightId,
          origin: flightFrom,
          destination: flightTo,
          departureTime,
          arrivalTime,
          itineraryId: selectedItineraryId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.id);
        setBooked(true);
      }
    } catch (error) {
      console.error('Error booking flight:', error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingId) return;

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'lol ' + accessToken
        }
      });

      if (response.ok) {
        router.push('/bookings');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  if (!signedIn) {
    return (
      <Box className="min-h-screen bg-gray-50">
        <Navbar />
        <Box className="container mx-auto px-4 py-8 mt-16">
          <Typography variant="h5">Please sign in to book flights</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Box className="container mx-auto px-4 py-8 mt-16">
        <Typography variant="h4" className="mb-6">Flight Booking</Typography>
        
        <Box className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Typography variant="h5" className="mb-4">Flight Details</Typography>
          <Typography variant="body1">From: {flightFrom}</Typography>
          <Typography variant="body1">To: {flightTo}</Typography>
          <Typography variant="body1">Departure: {new Date(departureTime!).toLocaleString()}</Typography>
          <Typography variant="body1">Arrival: {new Date(arrivalTime!).toLocaleString()}</Typography>
        </Box>

        <Box className="bg-white rounded-lg shadow-md p-6">
          <Typography variant="h5" className="mb-4">Select Itinerary</Typography>
          
          <FormControl fullWidth className="mb-4">
            <InputLabel>Select Existing Itinerary</InputLabel>
            <Select
              value={selectedItineraryId}
              onChange={handleItineraryChange}
              label="Select Existing Itinerary"
            >
              {itineraries.map((itinerary) => (
                <MenuItem key={itinerary.id} value={itinerary.id}>
                  {itinerary.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className="flex gap-4 mb-4">
            <FormControl fullWidth>
              <InputLabel>New Itinerary Name</InputLabel>
              <Select
                value={newItineraryName}
                onChange={(e) => setNewItineraryName(e.target.value)}
                label="New Itinerary Name"
              >
                <MenuItem value="Business Trip">Business Trip</MenuItem>
                <MenuItem value="Vacation">Vacation</MenuItem>
                <MenuItem value="Family Visit">Family Visit</MenuItem>
                <MenuItem value="Weekend Getaway">Weekend Getaway</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleCreateNewItinerary}
              disabled={!newItineraryName}
            >
              Create New Itinerary
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={booked ? handleConfirmBooking : handleBooking}
            disabled={!selectedItineraryId}
          >
            {booked ? 'Confirm Booking' : 'Book Flight'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
