'use client'

import Navbar from "@/components/navbar"
import { Box, InputLabel, Select, TextField, Typography, SelectChangeEvent, MenuItem, FormControl, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';

export default function HotelBooking() {

    const params = useSearchParams();
    const hotelId = params.get('hotelId');
    const roomTypeId = params.get('roomTypeId');

    const [hotel, setHotel] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryName, setItineraryName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    const handleItineraryChange = (event: SelectChangeEvent) => {
        setItineraryName(event.target.value as string);
    };

    const handleCheckInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckInDate(event.target.value);
    };

    const handleCheckOutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckOutDate(event.target.value);
    };

    const handleSubmit = async () => {
        // You can gather the data you want to submit
        const formData = {
            hotelId,
            roomTypeId,
            checkInDate,
            checkOutDate,
            itineraryName,
        };

        try {
            // Send form data to a dummy URL (replace with your actual URL)
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                console.log('Form submitted successfully!');
                const bookingData = await response.json();
                const bookingId = bookingData.id;
                redirect(`/payment/${bookingId}`);
            } else {
                console.error('Form submission failed.');
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Fetch hotel and roomType data once hotelId or roomTypeId changes
    useEffect(() => {
        if (!hotelId || !roomTypeId) return; // Avoid making requests if IDs are missing
        const fetchData = async () => {
            const hotelResponse = await fetch(`http://localhost:3000/api/hotels/${hotelId}`);
            try {
                const hotelData = await hotelResponse.json(); // Parse the JSON response
                setHotel(hotelData);
            } catch (error) {
                console.log(error);
            }

            const roomTypeResponse = await fetch(`http://localhost:3000/api/hotels/${hotelId}/roomTypes/${roomTypeId}`);
            try {
                const roomTypeData = await roomTypeResponse.json(); // Parse the JSON response
                setRoomType(roomTypeData);
            } catch (error) {
                console.log(error);
            }

            const accessToken = await localStorage.getItem('accessToken');
            const itinerariesResponse = await fetch("http://localhost:3000/api/itineraries", {
                headers: {
                    'Authorization': ("lol " + accessToken) || ''
                }
            });
            try {
                const itinerariesData = await itinerariesResponse.json(); // Parse the JSON response
                setItineraries(itinerariesData);
                if (itinerariesData.length > 0) {
                    setItineraryName(itinerariesData[0].name); // Set default itineraryName
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [hotelId, roomTypeId]);

    useEffect(() => {
        if (hotel) console.log("Hotel data:", hotel);
        if (roomType) console.log("Room Type data:", roomType);
        if (itineraries) console.log("Itineraries:", itineraries);
        if (itineraryName) console.log("Itinerary name:", itineraryName);
    }, [hotel, roomType, itineraries, itineraryName]);

    return (
        <div className="bg-white">
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'ffffff', height: '100vh', width: '100vw' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', height: '50vh', width: '50vw', padding: '2rem', backgroundColor: 'ffffff' }}>
                    <Typography variant="h4" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Make a booking</Typography>

                    <Typography variant="h2" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        {hotel ? hotel.name : 'Loading hotel data...'}
                    </Typography>

                    <Typography variant="h5" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        {roomType ? roomType.type : 'Loading room type data...'}
                    </Typography>

                    <TextField
                        id="check-in-date"
                        label="CheckInDate"
                        variant="outlined"
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={checkInDate}
                        onChange={handleCheckInChange}
                    />
                    <TextField
                        id="check-out-date"
                        label="CheckOutDate"
                        variant="outlined"
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={checkOutDate}
                        onChange={handleCheckOutChange}
                    />

                    <FormControl sx={{ marginY: '1rem', maxWidth: '20rem' }}>
                        <InputLabel id="itinerary-label" sx={{ width: '15rem' }}>Itinerary</InputLabel>
                        <Select
                            labelId="itinerary-label"
                            id="itinerary-select"
                            value={itineraryName}
                            label="Itinerary"
                            onChange={handleItineraryChange}
                        >
                            {itineraries.map((itinerary, i) => (
                                <MenuItem value={itinerary.name} key={i}>{itinerary.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        sx={{ marginTop: '1rem', maxWidth: '20rem' }}
                        onClick={handleSubmit}
                    >
                        Proceed to payment
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
