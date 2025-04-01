"use client";

import React, { useState } from 'react';
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

function SearchBar() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<'hotels' | 'flights'>('hotels');
  const [searchQuery, setSearchQuery] = useState('');
  const [travelers, setTravelers] = useState('2 travelers, 1 room (TBD)');
  const [dates, setDates] = useState('Apr 11 - Apr 13 (TBD)');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${searchType}/city=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
          <input
            type="text"
            className="w-full p-3 border text-black rounded-lg"
            value={dates}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
          <input
            type="text"
            className="w-full p-3 border text-black rounded-lg"
            value={travelers}
            readOnly
          />
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