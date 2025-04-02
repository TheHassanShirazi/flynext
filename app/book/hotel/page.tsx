'use client'

import Navbar from "@/components/navbar"
import { Box, InputLabel, Select, TextField, Typography, SelectChangeEvent, MenuItem } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HotelBooking() {

    const params = useSearchParams();
    const hotelId = params.get('hotelId');
    console.log("hotelId: " + hotelId);
    const roomTypeId = params.get('roomTypeId');
    console.log("roomTypeId: " + roomTypeId);

    const [hotel, setHotel] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryName, setItineraryName] = useState('');

    const handleItineraryChange = (event: SelectChangeEvent) => {
      setItineraryName(event.target.value as string);
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

            const itinerariesResponse = await fetch("http://localhost:3000/api/itineraries");
            try {
                const itinerariesData = await itinerariesResponse.json(); // Parse the JSON response
                setItineraries(itinerariesData);
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchData();
    }, [hotelId, roomTypeId]);

    useEffect(() => {
        if (hotel) console.log("Hotel data:", hotel);
        if (roomType) console.log("Room Type data:", roomType);
    }, [hotel, roomType]);

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
                    
                    <TextField id="outlined-basic" label="CheckInDate" variant="outlined" sx={{ marginY: '1rem', maxWidth: '20rem' }} />
                    <TextField id="outlined-basic" label="CheckOutDate" variant="outlined" sx={{ marginY: '1rem', maxWidth: '20rem' }} />

                    <InputLabel id="demo-simple-select-label" sx={{ width: '15rem' }}>Itinerary</InputLabel>                        
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={itineraryName}
                        label="Itinerary"
                        onChange={handleItineraryChange}
                    >
                    {itineraries.map(itinerary => 
                        <MenuItem value={itinerary.name}>Ten</MenuItem>
                    )}
                    </Select>
                </Box>
            </Box>
        </div>
    );
}
