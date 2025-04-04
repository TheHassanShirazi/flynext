// flightSearchBar.tsx

'use client';

import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Flight {
  id: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
}

function FlightSearchBar() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dateString, setDateString] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (origin.trim() && destination.trim() && date) {
      setLoading(true);
      setError(null);
      const dateStr = date.toISOString().split('T')[0];

      try {
        const response = await fetch(`http://localhost:3000/api/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${dateStr}`);

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch flights");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setFlights(data.flights);
        setLoading(false);

      } catch (err) {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    }
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      setDateString(selectedDate.toLocaleDateString());
    } else {
      setDateString("");
    }
    setShowCalendar(false);
  };

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Calendar = ({ onSelect, onClose, selectedDate }: {
    onSelect: (date: Date | null) => void;
    onClose: () => void;
    selectedDate: Date | null;
  }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateClick = (day: number) => {
      onSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      onClose();
    };

    const renderDays = () => {
      const days = [];
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

        days.push(
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`h-10 w-10 rounded-full flex items-center justify-center text-gray-900 font-medium
              ${isSelected ? 'bg-blue-900 text-white' : ''}
              hover:bg-blue-300 hover:text-white transition-colors`}
          >
            {day}
          </button>
        );
      }

      return days;
    };

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50 w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-800"
          >
            ←
          </button>
          <span className="font-semibold text-gray-900">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-800"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={Math.random()} className="text-center font-medium text-gray-800">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>
    );
  };

  return (
    <Box>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <LocationOnIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <LocationOnIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="relative" ref={calendarRef}>
            <DateRangeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Select date"
              value={dateString}
              readOnly
              onClick={() => setShowCalendar(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
            {showCalendar && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 10,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: 3,
                  mt: 1,
                }}
              >
                <Calendar onSelect={handleDateSelect} onClose={() => setShowCalendar(false)} selectedDate={date} />
              </Box>
            )}
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
        >
          Search Flights
        </button>
      </div>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ marginTop: 2, color: 'red' }}>
          {error}
        </Box>
      )}

      {flights.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Flights:</Typography>
          <ul>
            {flights.map((flight) => (
              <li key={flight.id}>
                {flight.origin} to {flight.destination} on {flight.date}: ${flight.price}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}

export default FlightSearchBar;