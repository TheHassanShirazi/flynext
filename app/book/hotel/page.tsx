'use client'

import Navbar from "@/components/navbar"
import { Box, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";


export default function HotelBooking() {

    const params = useSearchParams();
    const hotelId = params.get('hotelId');
    console.log("hotelId: " + hotelId);
    const roomTypeId = params.get('roomTypeId');
    console.log("roomTypeId: " + roomTypeId);

    return (
        <div className="bg-white">
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'ffffff', height: '100vh', width: '100vw' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', height: '50vh', width: '50vw', padding: '2rem', backgroundColor: 'ffffff' }}>
                    <Typography variant="h3" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Make a booking</Typography>
                    <Typography variant="h5" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Hotel:</Typography>
                    <Typography variant="h5" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Room Type:</Typography>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{ marginY: '1rem', maxWidth: '20rem' }} />
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{ marginY: '1rem', maxWidth: '20rem' }} />

                </Box>
            </Box>
        </div>
    );
}
