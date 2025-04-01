"use client";

import React from 'react';

function Button({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`text-white px-6 py-3 rounded-full bg-black hover:bg-gray-800 transition-colors duration-300 ${className}`}>
      {children}
    </button>
  );
}

function Navbar() {
  return (
    <nav className="w-full bg-white backdrop-blur-md bg-opacity-80 shadow-sm p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <h1 className="text-2xl font-semibold text-black">FlyNext</h1>
      <div className="flex space-x-4">
        <a href="#" className="text-gray-800 hover:text-black transition-colors duration-300">Home</a>
        <a href="#" className="text-gray-800 hover:text-black transition-colors duration-300">About</a>
        <Button>Get Started</Button>
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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-20 mt-16">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-semibold text-black mb-6 leading-tight">
            Effortless Travel, Seamlessly Planned.
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Discover the future of travel management with FlyNext. Simplify your flight and hotel bookings with our intuitive platform.
          </p>
          <Button className="text-lg px-8 py-3">Explore Now</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}