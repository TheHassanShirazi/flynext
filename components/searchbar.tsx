"use client";

import { Box, Button, TextField, Typography, CircularProgress, Autocomplete, List, ListItem, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


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

function TravelersSelector({ onSelect, onClose, currentValue }: {
  onSelect: (value: string) => void;
  onClose: () => void;
  currentValue: string;
}) {
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  console.log(currentValue);

  const handleChange = (type: 'adults' | 'rooms', operation: 'add' | 'subtract') => {
    if (type === 'adults') {
      setAdults(prev => operation === 'add' ? prev + 1 : Math.max(1, prev - 1));
    } else {
      setRooms(prev => operation === 'add' ? prev + 1 : Math.max(1, prev - 1));
    }
  };

  const handleDone = () => {
    onSelect(`${adults} travelers, ${rooms} room${rooms > 1 ? 's' : ''}`);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50 w-[300px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">Adults</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChange('adults', 'subtract')}
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-500 text-gray-900"
            >
              -
            </button>
            <span className="text-gray-900 font-medium">{adults}</span>
            <button
              onClick={() => handleChange('adults', 'add')}
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-500 text-gray-900"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">Rooms</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChange('rooms', 'subtract')}
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-500 text-gray-900"
            >
              -
            </button>
            <span className="text-gray-900 font-medium">{rooms}</span>
            <button
              onClick={() => handleChange('rooms', 'add')}
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-500 text-gray-900"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleDone} className="px-4 py-2">Done</Button>
      </div>
    </div>
  );
}

function Calendar({ onSelect, onClose, selectedDates }: {
  onSelect: (dates: { start: Date; end: Date }) => void;
  onClose: () => void;
  selectedDates: { start: Date | null; end: Date | null };
}) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [tempDates, setTempDates] = useState(selectedDates);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (selecting === 'start') {
      setTempDates({ start: selectedDate, end: null });
      setSelecting('end');
    } else {
      if (tempDates.start && selectedDate >= tempDates.start) {
        setTempDates(prev => ({ ...prev, end: selectedDate }));
      }
    }
  };

  const handleDone = () => {
    if (tempDates.start && tempDates.end) {
      onSelect({
        start: tempDates.start,
        end: tempDates.end
      });
      onClose();
    }
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
      const isSelected = tempDates.start && date.getTime() === tempDates.start.getTime() ||
        tempDates.end && date.getTime() === tempDates.end.getTime();
      const isInRange = tempDates.start && tempDates.end &&
        date > tempDates.start && date < tempDates.end;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-gray-900 font-medium
            ${isSelected ? 'bg-blue-900 text-white' : ''}
            ${isInRange ? 'bg-blue-500 text-white' : ''}
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
      <div className="mt-4 flex justify-end">
        <Button onClick={handleDone} className="px-4 py-2">Done</Button>
      </div>
    </div>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"hotels" | "flights">("hotels");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("2 travelers, 1 room");
  const [dates, setDates] = useState("Select dates");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateForFlightSearch, setDateForFlightSearch] = useState<Date | null>(null);
  const [dateString, setDateString] = useState("");
  const [autocompleteOptionsOrigin, setAutocompleteOptionsOrigin] = useState<string[]>([]);
  const [autocompleteOptionsDestination, setAutocompleteOptionsDestination] = useState<string[]>([]);

  const handleSearch = async () => {
    if (origin.trim()) {
      if (searchType === "flights" && dateForFlightSearch && destination.trim()) {
        setLoading(true);
        setError(null);
        const dateStr = dateForFlightSearch.toISOString().split('T')[0];
        try {
          const response = await fetch(`http://localhost:3000/api/flights/search/?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${dateStr}`);

          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch flights");
            setLoading(false);
            return;
          }

          const data = await response.json();
          setFlights(data.flights.results.flatMap((leg) => leg.flights));
          setLoading(false);
        } catch (err) {
          console.error("Error fetching flights: ", err);
          setError("An unexpected error occurred.");
          setLoading(false);
        }
      } else if (searchType === 'hotels') {
        console.log(origin);
        router.push(`/${searchType}/search?city=${encodeURIComponent(origin)}&checkInDate=${encodeURIComponent(dates.split(' -')[0])}&checkOutDate=${encodeURIComponent(dates.split('- ')[1])}`);
      }
    }
  };

  function formatDate(date: Date) {
    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  
    // Return the formatted date string
    return `${year}-${month}-${day}`;
  }  

  const handleDateSelect = (dates: { start: Date; end: Date }) => {
    if (dates.start.getTime() !== dates.end.getTime()){
      setSelectedDates(dates);
      setDates(`${formatDate(dates.start)} - ${formatDate(dates.end)}`);
    }
  };

  const handleDateSelectForFlight = (selectedDate: Date | null) => {
    setDateForFlightSearch(selectedDate);
    if (selectedDate) {
      setDateString(selectedDate.toLocaleDateString());
    } else {
      setDateString("");
    }
    setShowCalendar(false);
  };

  const calendarRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) {
        setShowTravelers(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAutocompleteOptions = async (query: string, setOptions: (options: string[]) => void) => {
    try {
      const response = await fetch(`http://localhost:3000/api/flights/autocomplete?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setOptions(data.possible_search);
      }
    } catch (error) {
      console.error("Error fetching autocomplete options:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: 3,
        maxWidth: "900px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Buttons for Hotels / Flights */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant={searchType === "hotels" ? "contained" : "outlined"}
          sx={{ flex: 1, borderRadius: "25px", fontSize: "1rem", textTransform: "none" }}
          onClick={() => setSearchType("hotels")}
        >
          Hotels
        </Button>
        <Button
          variant={searchType === "flights" ? "contained" : "outlined"}
          sx={{ flex: 1, borderRadius: "25px", fontSize: "1rem", textTransform: "none" }}
          onClick={() => setSearchType("flights")}
        >
          Flights
        </Button>
      </Box>

      {/* Search Inputs */}
      <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          width: "100%",
          maxWidth: "60rem", // Increased max width
          margin: "auto"
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {/* Origin Input */}
            <Box sx={{ display: "flex", flexDirection: "column", marginRight: '1rem', flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray" }}>
              {searchType === "hotels" ? "City" : "Origin"}
            </Typography>
            <Autocomplete
              freeSolo
              options={autocompleteOptionsOrigin}
              inputValue={origin}
              onInputChange={(event, newValue) => {
              setOrigin(newValue);
              fetchAutocompleteOptions(newValue, setAutocompleteOptionsOrigin);
              }}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" placeholder={searchType === "hotels" ? "Where are you going?" : "Flying from"} />}
            />
            </Box>

            {/* Destination Input */}
            {searchType === "flights" && (
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray" }}>
              Destination
              </Typography>
              <Autocomplete
              freeSolo
              options={autocompleteOptionsDestination}
              inputValue={destination}
              onInputChange={(event, newValue) => {
                setDestination(newValue);
                fetchAutocompleteOptions(newValue, setAutocompleteOptionsDestination);
              }}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" placeholder="Flying to" />}
              />
            </Box>
            )}
        </Box>
        {/* Date Picker */}
        <Box sx={{ position: "relative" }} ref={calendarRef}>
          <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray" }}>
            {searchType === "hotels" ? "Dates" : "Date"}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Select dates"
            value={searchType === "hotels" ? dates : dateString}
            onClick={() => setShowCalendar(true)}
            InputProps={{
              startAdornment: <DateRangeIcon sx={{ color: "gray", marginRight: 1 }} />,
              readOnly: true,
            }}
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
              {searchType === "hotels" ? (
                <Calendar onSelect={handleDateSelect} onClose={() => setShowCalendar(false)} selectedDates={selectedDates} />
              ) : (
                <Calendar onSelect={(dates: { start: Date; end: Date }) => handleDateSelectForFlight(dates.start)} onClose={() => setShowCalendar(false)} selectedDates={{ start: dateForFlightSearch, end: null }} />
              )}
            </Box>
          )}
        </Box>

        {/* Travelers Input */}
        {searchType === "hotels" && (
          <Box sx={{ position: "relative" }} ref={travelersRef}>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray" }}>
              Travelers & Rooms
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Select travelers"
              value={travelers}
              onClick={() => setShowTravelers(true)}
              InputProps={{
                startAdornment: <PersonIcon sx={{ color: "gray", marginRight: 1 }} />,
                readOnly: true,
              }}
            />
            {showTravelers && (
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
                <TravelersSelector onSelect={setTravelers} onClose={() => setShowTravelers(false)} currentValue={travelers} />
              </Box>
            )}
          </Box>
        )}

        {/* Search Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "12px",
            height: "100%",
            minWidth: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleSearch}
        >
          <SearchIcon sx={{ fontSize: "2rem" }} />
        </Button>
      </Box>
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
          <Typography variant="h6" sx={{ color: 'black' }}>Flights:</Typography>
          <List>
            {flights.map((flight) => (
              <ListItem key={flight.id}>
          <ListItemText
            primaryTypographyProps={{ sx: { color: 'black' } }}
            secondaryTypographyProps={{ sx: { color: 'black' } }}
            primary={`${flight.origin.city} (${flight.origin.code}) to ${flight.destination.city} (${flight.destination.code})`}
            secondary={`Departure: ${new Date(flight.departureTime).toLocaleString()}, Arrival: ${new Date(flight.arrivalTime).toLocaleString()}, Price: ${flight.price} ${flight.currency}`}
          />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}