"use client"; // Needed for event handlers like onClick in Next.js app router

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/button"; // Default import

export default function Navbar() {
    const [firstName, setFirstName] = useState<string | null>(null);

    useEffect(() => {
        const storedFirstName = localStorage.getItem("firstName");
        setFirstName(storedFirstName);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("firstName");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setFirstName(null);
        window.location.href = "http://localhost:3000/";
    };

    return (
        <nav className="w-full bg-white shadow-sm p-4 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-semibold text-blue-600">FlyNext</h1>
                    <div className="relative group">
                        <button className="text-gray-600 hover:text-blue-600 flex items-center">
                            Search <span className="ml-1">▼</span>
                        </button>
                        <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-lg p-2 w-48">
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Flights</a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hotels</a>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    {firstName ? (
                        <>
                            <span className="text-gray-600">Welcome, {firstName}!</span>
                            <Button className="!py-2" onClick={() => window.location.href = '/edit-profile'}>
                                Edit Profile
                            </Button>
                            <Button className="!py-2" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/myhotels" className="text-gray-600 hover:text-blue-600">
                                List your hotel
                            </Link>
                            <Link href="/itineraries" className="text-gray-600 hover:text-blue-600">
                                My trips
                            </Link>
                            <Button className="!py-2" onClick={() => window.location.href = '/signup'}>
                                Sign up
                            </Button>
                            <Button className="!py-2" onClick={() => window.location.href = '/login'}>
                                Login
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}