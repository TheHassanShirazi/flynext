"use client";

import React from 'react';
import SearchBar from '@/components/searchbar';
import Navbar from '@/components/navbar';


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
            Flynext
          </h1>
          <p className="text-xl text-gray-600">
            To get you wherever you want to go.
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