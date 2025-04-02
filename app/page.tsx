"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/searchbar';
import Navbar from '@/components/navbar';

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
        <div className="mt-15">
          <SearchBar />
        </div>
      </main>
      <Footer />
    </div>
  );
}