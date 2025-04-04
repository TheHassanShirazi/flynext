"use client"; // Needed for event handlers like onClick in Next.js app router

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/button"; // Default import
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Navbar() {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [ownsHotels, setOwnsHotels] = useState<boolean>(false); // State to track if user owns any hotels
    const [unreadNotifications, setUnreadNotifications] = useState([]); // State for notifications
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to control dropdown visibility

    useEffect(() => {
        // Get the first name from localStorage
        const storedFirstName = localStorage.getItem("firstName");
        setFirstName(storedFirstName);

        // Check if the user owns any hotels
        const checkUserHotels = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    const response = await fetch("http://localhost:3000/api/hotels", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    });
                    const hotels = await response.json();
                    // If the response contains hotels, set ownsHotels to true
                    setOwnsHotels(hotels.length > 0);
                } catch (error) {
                    console.error("Error checking hotels:", error);
                }
            }
        };

        checkUserHotels();
    }, []);

    useEffect(() => {
        // Function to call the API for unread notifications
        function callApi() {
            fetch('http://localhost:3000/api/notifications', {
                headers: {
                    'Authorization': 'lol ' + localStorage.getItem('accessToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Notification response:', data);
                    setUnreadNotifications(data);
                })
                .catch((error) => {
                    console.error('Error calling API:', error);
                });
        }
        if (!firstName) return; // Don't call the API if the user is not logged in

        // Call the API every 3 seconds (3000 milliseconds)
        const intervalId = setInterval(callApi, 3000);

        // Clean up the interval when the component unmounts or when dependencies change
        return () => clearInterval(intervalId);
    }, [firstName]); // Empty dependency array ensures this runs once when the component mounts

    const handleLogout = () => {
        localStorage.removeItem("firstName");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setFirstName(null);
        window.location.href = "http://localhost:3000/";
    };

    // Toggle the visibility of the notification dropdown
    const toggleDropdown = () => {
        // If the dropdown is being opened, mark notifications as read
        if (!isDropdownVisible && unreadNotifications.length > 0) {
            resetNotifications();
        }
        setIsDropdownVisible(!isDropdownVisible);
    };

    const resetNotifications = async () => {
        // Mark each notification as read
        for (const notification of unreadNotifications) {
            console.log('Marking notification as read:', notification.id);
            await fetch(`http://localhost:3000/api/notifications/${notification.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'lol ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Notification marked as read:', data);
                })
                .catch(error => {
                    console.error('Error marking notification as read:', error);
                });
        }
        setUnreadNotifications([]); // Clear notifications from the UI after marking them as read
    };

    return (
        <nav className="w-full bg-white shadow-sm p-4 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    {/* "FlyNext" wrapped in a Link to go to the homepage */}
                    <Link href="/" passHref>
                        <h1 className="text-2xl font-semibold text-blue-600 cursor-pointer">
                            FlyNext
                        </h1>
                    </Link>

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
                            <Link href="/myhotels" className="text-gray-600 hover:text-blue-600">
                                {ownsHotels ? 'Your hotels' : 'List your hotel'}
                            </Link>
                            
                            <div className="relative">
                                <button onClick={toggleDropdown}>
                                    {unreadNotifications.length === 0 ? (
                                        <NotificationsIcon />
                                    ) : (
                                        <NotificationsActiveIcon />
                                    )}
                                </button>
                                
                                {/* Dropdown for unread notifications */}
                                {isDropdownVisible && (
                                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 max-h-60 overflow-y-auto">
                                        <h3 className="font-semibold text-gray-700">Unread Notifications</h3>
                                        <ul className="space-y-2 mt-2">
                                            {unreadNotifications.length === 0 ? (
                                                <li>No new notifications</li>
                                            ) : (
                                                unreadNotifications.map((notification, index) => (
                                                    <li key={index} className="text-gray-600">
                                                        {notification.message}
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <Button className="!py-2" onClick={() => window.location.href = '/edit-profile'}>
                                Edit Profile
                            </Button>
                            <Button className="!py-2" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>                            

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
