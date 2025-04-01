"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Button({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-white px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
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
          <div key={day} className="text-center font-medium text-gray-800">{day}</div>
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

function TravelersSelector({ onSelect, onClose, currentValue }: {
  onSelect: (value: string) => void;
  onClose: () => void;
  currentValue: string;
}) {
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

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

function SearchBar() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<'hotels' | 'flights'>('hotels');
  const [searchQuery, setSearchQuery] = useState('');
  const [travelers, setTravelers] = useState('2 travelers, 1 room');
  const [dates, setDates] = useState('Select dates');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${searchType}/city=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDateSelect = (dates: { start: Date; end: Date }) => {
    setSelectedDates(dates);
    setDates(`${dates.start.toLocaleDateString()} - ${dates.end.toLocaleDateString()}`);
  };

  // Close dropdowns when clicking outside
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl bg-blue-50 rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSearchType('hotels')}
          className={`px-4 py-2 rounded-full ${
            searchType === 'hotels' ? 'bg-blue-600 text-white' : 'bg-white-900'
          }`}
        >
          <p className="text-black">Hotels</p>
        </button>
        <button
          onClick={() => setSearchType('flights')}
          className={`px-4 py-2 rounded-full ${
            searchType === 'flights' ? 'bg-blue-600 text-white' : 'bg-white-900'
          }`}
        >
          <p className="text-black">Flights</p>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Where to?</label>
          <input
            type="text"
            placeholder={searchType === 'hotels' ? "Going to" : "Flying to"}
            className="w-full p-3 border text-black rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative" ref={calendarRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
          <input
            type="text"
            className="w-full p-3 border text-black rounded-lg cursor-pointer"
            value={dates}
            onClick={() => setShowCalendar(true)}
            readOnly
          />
          {showCalendar && (
            <Calendar
              onSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
              selectedDates={selectedDates}
            />
          )}
        </div>
        <div className="relative" ref={travelersRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
          <input
            type="text"
            className="w-full p-3 border text-black rounded-lg cursor-pointer"
            value={travelers}
            onClick={() => setShowTravelers(true)}
            readOnly
          />
          {showTravelers && (
            <TravelersSelector
              onSelect={setTravelers}
              onClose={() => setShowTravelers(false)}
              currentValue={travelers}
            />
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSearch} className="px-8">
          Search
        </Button>
      </div>
    </div>
  );
}

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm p-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-semibold text-blue-600">FlyNext</h1>
          <div className="relative group">
            <button className="text-gray-600 hover:text-blue-600 flex items-center">
              More travel <span className="ml-1">▼</span>
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-lg p-2 w-48">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Flights</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hotels</a>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="/list-property" className="text-gray-600 hover:text-blue-600">
            List your hotel
          </a>
          <a href="/itinerary" className="text-gray-600 hover:text-blue-600">
            My trips
          </a>
          <Button className="!py-2">
            Sign in
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-600 text-center p-6 mt-12 border-t border-gray-200">
      <p>&copy; 2025 FlyNext. All rights reserved.</p>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex flex-col items-center px-6 py-20 mt-16">
        <div className="max-w-4xl text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Find your next stay
          </h1>
          <p className="text-xl text-gray-600">
            Search deals on hotels, homes, and much more...
          </p>
        </div>
        <SearchBar />
      </main>
      <Footer />
    </div>
  );
}