'use client'

import Navbar from "@/components/navbar"
import { Box, InputLabel, Select, TextField, Typography, SelectChangeEvent, MenuItem, FormControl, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function HotelBooking() {
    const router = useRouter();
    const params = useSearchParams();
    const flightId = params.get('flightId');
    const flightFrom = params.get('flightFrom');
    const flightTo = params.get('flightTo');
    const departureTime = params.get('departureTime');
    const arrivalTime = params.get('arrivalTime');
    const seatsParam = params.get('seats');

    const [signedIn, setSignedIn] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryId, setItineraryId] = useState('');

    const [numberOfSeats, setNumberOfSeats] = useState(seatsParam);

    const [creditCardName, setCreditCardName] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [creditCardExpiry, setCreditCardExpiry] = useState('');
    const [creditCardCVC, setCreditCardCVC] = useState('');
    const [nameError, setNameError] = useState(true);
    const [numberError, setNumberError] = useState(true);
    const [expiryError, setExpiryError] = useState(true);
    const [cvcError, setCVCError] = useState(true);

    const [booked, setBooked] = useState(false);
    const [prevBookingId, setPrevBookingId] = useState(null);
    
    // Fetch hotel and roomType data once hotelId or roomTypeId changes
    useEffect(() => {
        if (!flightId) return; // Avoid making requests if IDs are missing
        const fetchData = async () => {
            const accessToken = await localStorage.getItem('accessToken');
            const itinerariesResponse = await fetch("http://localhost:3000/api/itineraries", {
                headers: {
                    'Authorization': ("lol " + accessToken) || ''
                }
            });
            try {
                const itinerariesData = await itinerariesResponse.json(); // Parse the JSON response
                console.log(itinerariesData);
                setSignedIn(true);
                setItineraries(itinerariesData);
                if (itinerariesData.length > 0) {
                    setItineraryId(itinerariesData[0].id); // Set default itineraryId
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [flightId]);


    const handleCreditCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditCardName(event.target.value);
        if (event.target.value.trim() === '') {
            setNameError(true);
        } else {
            setNameError(false);
        }
    };

    const handleCreditCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditCardNumber(event.target.value);
        const value = event.target.value;
        if (value.trim() === '' || value.length < 15 || value.length > 16) {
            setNumberError(true);
        } else {
            setNumberError(false);
        }
    };

    const handleCreditCardExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditCardExpiry(event.target.value);
        if (event.target.value.trim() === '') {
            setExpiryError(true);
        } else {
            setExpiryError(false);
        }
    };

    const handleCreditCardCVCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditCardCVC(event.target.value);
        const value = event.target.value;
        if (value.trim() === '' || value.length < 3 || value.length > 4) {
            setCVCError(true);
        } else {
            setCVCError(false);
        }
    };

    const handleSubmit = async () => {

        if (booked) {
            setBooked(false);
            await fetch(`http://localhost:3000/api/bookings/${prevBookingId}`, {
                method: 'DELETE'
            });

            return;
        }
        
        setBooked(true);

        const formData = {
            flightId,
            origin: flightFrom,
            destination: flightTo,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            itineraryId
        };

        try {
            
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'lol ' + accessToken
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                console.log('Booking submitted successfully!');
                const bookingData = await response.json();
                console.log(bookingData);
                setPrevBookingId(bookingData.id);
            } else {
                console.error('Form submission failed.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleConfirm = async () => {

        try {
            const response = await fetch(`http://localhost:3000/api/bookings/${prevBookingId}/confirm`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Booking confirmed successfully!');
                const bookingData = await response.json();
                console.log(bookingData);
                setPrevBookingId(bookingData.id);
                router.push('/bookings');
            } else {
                console.error('Form submission failed.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    const handleItineraryChange = (event: SelectChangeEvent) => {
        setItineraryId(event.target.value as string);
    };

    const handleNumberOfSeatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfSeats(event.target.value);
    }; 


    return (
        <div className="bg-white">
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Navbar />

            { signedIn && (flightId && arrivalTime && departureTime && flightFrom && flightTo) &&
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'ffffff', height: '100vh', width: '100vw', marginTop: '-5rem', marginBottom: '25rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', height: '50vh', width: '50vw', padding: '2rem', backgroundColor: 'ffffff' }}>
                    <Typography variant="h4" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Book a flight</Typography>

                    <Typography variant="h3" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        Flight from {flightFrom} to {flightTo}
                    </Typography>

                    <Typography variant="h5" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        Departure at {departureTime} and Arrival at {arrivalTime}
                    </Typography>

                    <TextField
                        id="number-of-seats"
                        label="numberOfSeats"
                        variant="outlined"
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={numberOfSeats}
                        disabled={booked}
                        onChange={handleNumberOfSeatsChange}
                    />

                    <FormControl sx={{ marginY: '1rem', maxWidth: '20rem' }}>
                        <InputLabel id="itinerary-label" sx={{ width: '15rem' }}>Itinerary</InputLabel>
                        <Select
                            labelId="itinerary-label"
                            id="itinerary-select"
                            value={itineraryId}
                            label="Itinerary"
                            disabled={booked}
                            onChange={handleItineraryChange}
                            defaultValue=""
                        >
                            {itineraries.map((itinerary, i) => (
                                <MenuItem value={itinerary.id} key={i}>{itinerary.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        sx={{ marginTop: '1rem', maxWidth: '20rem' }}
                        onClick={handleSubmit}
                    >
                        {booked ? 'Return to booking' : 'Proceed to payment'}
                    </Button>

                    <TextField
                        id="credit-card-name"
                        label="CreditCardName"
                        variant="outlined"
                        error={nameError}
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={creditCardName}
                        disabled={!booked}
                        onChange={handleCreditCardNameChange}
                    />

                    <TextField
                        id="credit-card-number"
                        label="CreditCardNumber"
                        variant="outlined"
                        error={numberError}
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={creditCardNumber}
                        disabled={!booked}
                        onChange={handleCreditCardNumberChange}
                    />

                    <TextField
                        id="credit-card-expiry"
                        label="CreditCardExpiry"
                        variant="outlined"
                        error={expiryError}
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={creditCardExpiry}
                        disabled={!booked}
                        onChange={handleCreditCardExpiryChange}
                    />

                    <TextField
                        id="credit-card-cvc"
                        label="CreditCardCVC"
                        variant="outlined"
                        error={cvcError}
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={creditCardCVC}
                        disabled={!booked}
                        onChange={handleCreditCardCVCChange}
                    />

                    <Button
                        variant="contained"
                        sx={{ marginTop: '1rem', maxWidth: '20rem' }}
                        disabled={!booked}
                        onClick={handleConfirm}
                    >
                        {'Confirm booking'}
                    </Button>
                </Box>
            </Box>
        }
        {!signedIn &&
        <div className='flex items-center justify-center'>
            <p className='text-black text-3xl m-5'>Please sign in to make a booking.</p>
        </div>
        }
        {!(flightId && arrivalTime && departureTime && flightFrom && flightTo) &&
        <div className='flex items-center justify-center'>
            <p className='text-black text-3xl m-5'>Incomplete parameters.</p>
        </div>
        }
        </Suspense>
        </div>
    );
}