'use client';

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface Flight {
  id: string;
  origin: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
}

interface FlightResultsProps {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export default function FlightResults({ flights, loading, error }: FlightResultsProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Box className="mt-4 p-4 bg-white rounded-lg shadow">
        <Typography>Loading flights...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="mt-4 p-4 bg-white rounded-lg shadow">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Box className="mt-4 p-4 bg-white rounded-lg shadow">
        <Typography>No flights found.</Typography>
      </Box>
    );
  }

  const handleFlightClick = (flight: Flight) => {
    router.push(`/flights/book/${flight.id}?flightFrom=${flight.origin.city}&flightTo=${flight.destination.city}&departureTime=${flight.departureTime}&arrivalTime=${flight.arrivalTime}`);
  };

  return (
    <Box className="mt-4 space-y-4">
      {flights.map((flight) => (
        <Box
          key={flight.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleFlightClick(flight)}
        >
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h6" className="text-gray-900">
                {flight.origin.city} ({flight.origin.code}) → {flight.destination.city} ({flight.destination.code})
              </Typography>
              <Typography className="text-gray-600">
                Departure: {new Date(flight.departureTime).toLocaleString()}
              </Typography>
              <Typography className="text-gray-600">
                Arrival: {new Date(flight.arrivalTime).toLocaleString()}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="h5" className="text-blue-600 font-bold">
                {flight.currency} {flight.price}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="mt-2"
              >
                Select Flight
              </Button>
            </div>
          </div>
        </Box>
      ))}
    </Box>
  );
}
