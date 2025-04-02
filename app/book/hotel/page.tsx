'use client'

import Navbar from "@/components/navbar"
import { Box, InputLabel, Select, TextField, Typography, SelectChangeEvent, MenuItem, FormControl, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce'; // Import debounce function

export default function HotelBooking() {
    const router = useRouter();
    const params = useSearchParams();
    const hotelId = params.get('hotelId');
    const roomTypeId = params.get('roomTypeId');
    const checkInDateParam = params.get('checkInDate') || '';
    const checkOutDateParam = params.get('checkOutDate') || '';

    const [hotel, setHotel] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryId, setItineraryId] = useState('');
    const [checkInDate, setCheckInDate] = useState(checkInDateParam);
    const [checkOutDate, setCheckOutDate] = useState(checkOutDateParam);

    const [creditCardName, setCreditCardName] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [creditCardExpiry, setCreditCardExpiry] = useState('');
    const [creditCardCVC, setCreditCardCVC] = useState('');
    const [nameError, setNameError] = useState(true);
    const [numberError, setNumberError] = useState(true);
    const [expiryError, setExpiryError] = useState(true);
    const [cvcError, setCVCError] = useState(true);
    const [checkInDateError, setCheckInDateError] = useState(true);
    const [checkOutDateError, setCheckOutDateError] = useState(true);

    const [booked, setBooked] = useState(false);
    const [prevBookingId, setPrevBookingId] = useState(null);

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

    const [isPageLoaded, setIsPageLoaded] = useState(false); // Track page load state
    const [formChanged, setFormChanged] = useState(false); // Track form changes


    const handleSubmit = async () => {

        if (booked) {
            setBooked(false);
            await fetch(`http://localhost:3000/api/bookings/${prevBookingId}`, {
                method: 'DELETE'
            });

            return;
        }
        const formData = {
            hotelId,
            roomTypeId,
            checkInDate,
            checkOutDate,
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
            const response = await fetch(`http://localhost:3000/api/bookings/${prevBookingId}`, {
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
            } else {
                console.error('Form submission failed.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    function isValidDate(dateString: string) {
        // Regular expression to match the format DD-MM-YYYY
        const regex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        
        // Test if the date matches the format
        if (!regex.test(dateString)) {
            return false;
        }
        
        // Extract day, month, and year from the date string
        const [day, month, year] = dateString.split('-').map(num => parseInt(num, 10));
        
        // Check for valid day and month ranges
        const date = new Date(year, month - 1, day); // JavaScript months are 0-based
        return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
    }


    const handleItineraryChange = (event: SelectChangeEvent) => {
        setItineraryId(event.target.value as string);
        setFormChanged(true); // Mark the form as changed
        if (isValidDate(event.target.value)) {
            setCheckInDateError(false);
        } else {
            setCheckInDateError(true);
        }
    };

    const handleCheckInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckInDate(event.target.value);
        setFormChanged(true); // Mark the form as changed
        if (isValidDate(event.target.value)) {
            setCheckOutDateError(false);
        } else {
            setCheckOutDateError(true);
        }
    };

    const handleCheckOutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckOutDate(event.target.value);
        setFormChanged(true); // Mark the form as changed
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
                console.log(itinerariesData);
                setItineraries(itinerariesData);
                if (itinerariesData.length > 0) {
                    setItineraryId(itinerariesData[0].id); // Set default itineraryId
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [hotelId, roomTypeId]);

    // Mark the page as loaded after the initial fetch is done
    useEffect(() => {
        if (hotel && roomType && itineraries.length > 0) {
            setIsPageLoaded(true); // Set to true after fetching data
        }
    }, [hotel, roomType, itineraries]);

    return (
        <div className="bg-white">
            <Navbar />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'ffffff', height: '100vh', width: '100vw', marginTop: '-5rem', marginBottom: '25rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', height: '50vh', width: '50vw', padding: '2rem', backgroundColor: 'ffffff' }}>
                    <Typography variant="h4" sx={{ marginY: '3rem', color: '#011010', fontWeight: '500' }}>Make a booking</Typography>

                    <Typography variant="h2" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        {hotel ? hotel.name : 'Loading hotel data...'}
                    </Typography>

                    <Typography variant="h5" sx={{ marginY: '1rem', color: '#011010', fontWeight: '500' }}>
                        {roomType ? (roomType.type + ": $" + roomType.pricePerNight + " nightly") : 'Loading room type data...'}
                    </Typography>

                    <TextField
                        id="check-in-date"
                        label="CheckInDate"
                        variant="outlined"
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={checkInDate}
                        disabled={booked}
                        onChange={handleCheckInChange}
                    />
                    <TextField
                        id="check-out-date"
                        label="CheckOutDate"
                        variant="outlined"
                        sx={{ marginY: '1rem', maxWidth: '20rem' }}
                        value={checkOutDate}
                        disabled={booked}
                        onChange={handleCheckOutChange}
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
                        disabled={booked}
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
        </div>
    );
}