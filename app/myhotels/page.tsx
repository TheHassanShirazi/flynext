'use client'

import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '@/components/navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0800'
    },
    secondary: {
      main: '#0077b6'
    }
  },
});

export default function Hotels() {
  // State to manage form visibility
  const [formVisible, setFormVisible] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  
  // Form field states
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelRating, setHotelRating] = useState('');
  
  // State to manage the list of hotels and room types
  const [hotels, setHotels] = useState([]);
  
  // States to manage room type form visibility
  const [roomTypeVisible, setRoomTypeVisible] = useState(null); // Show/hide for each hotel

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) setSignedIn(true);

    // Fetch list of hotels when component mounts
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/hotels', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    
    fetchHotels();
  }, []);

  // Function to handle form submission for new hotel
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newHotel = {
      name: hotelName,
      address: hotelAddress,
      city: hotelCity,
      starRating: hotelRating,
    };

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      await fetch('http://localhost:3000/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHotel),
      });
      const response = await fetch('http://localhost:3000/api/hotels', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setHotels(data);
      setFormVisible(false);
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  // Function to handle adding a new room type
  const handleAddRoomType = async (hotelId, roomTypeData) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      await fetch(`http://localhost:3000/api/hotels/${hotelId}/roomTypes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomTypeData),
      });

      // After adding a room type, fetch updated room types
      const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}/roomTypes`);
      const roomTypes = await response.json();
      setHotels((prevHotels) =>
        prevHotels.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, roomTypes } : hotel
        )
      );
      setRoomTypeVisible(null); // Hide the form after submitting
    } catch (error) {
      console.error('Error adding room type:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {signedIn &&
        <div className="min-h-screen pt-20 pb-8 bg-gray-50 shadow-sm mt-10">
          <div className="container mx-auto px-4">
            <ThemeProvider theme={theme}>
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h2">My Hotels</Typography>
              </div>

              {/* Button to show/hide the form for adding a hotel */}
              <Box sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setFormVisible(!formVisible)}
                >
                  {formVisible ? 'Cancel' : 'Add New Hotel'}
                </Button>
              </Box>

              {/* Form for adding a new hotel */}
              {formVisible && (
                <Box
                  sx={{
                    mt: 3,
                    p: 4,
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: 3
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>Add Hotel</Typography>
                  <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>
                      <Grid>
                        <TextField
                          label="Hotel Name"
                          fullWidth
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          label="Address"
                          fullWidth
                          value={hotelAddress}
                          onChange={(e) => setHotelAddress(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          label="City"
                          fullWidth
                          value={hotelCity}
                          onChange={(e) => setHotelCity(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          label="Rating"
                          fullWidth
                          value={hotelRating}
                          onChange={(e) => setHotelRating(e.target.value)}
                          required
                          type="number"
                          inputProps={{ min: 1, max: 5 }}
                        />
                      </Grid>
                      <Grid sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          fullWidth
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              )}

              {/* List of Hotels */}
              <Box sx={{ mt: 5 }}>
                {hotels.length > 0 ? (
                  hotels.map((hotel) => (
                    <Box key={hotel.id} sx={{ mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: 3 }}>
                      <Typography variant="h6">{hotel.name}</Typography>
                      <Typography variant="body2">{hotel.address}, {hotel.city} - Rating: {hotel.starRating}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="secondary">
                          Edit Availability
                        </Button>
                        <Button variant="outlined" color="secondary">
                          Edit Info
                        </Button>
                      </Box>

                      {/* Add Room Type button */}
                      <Box sx={{ mt: 3 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => setRoomTypeVisible(hotel.id === roomTypeVisible ? null : hotel.id)}
                        >
                          {roomTypeVisible === hotel.id ? 'Cancel' : 'Add Room Type'}
                        </Button>
                      </Box>

                      {/* Room Type form for adding a room type */}
                      {roomTypeVisible === hotel.id && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 4,
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            boxShadow: 3
                          }}
                        >
                          <Typography variant="h5" sx={{ mb: 2 }}>Add Room Type</Typography>
                          <RoomTypeForm
                            hotelId={hotel.id}
                            handleAddRoomType={handleAddRoomType}
                          />
                        </Box>
                      )}

                      {/* List of Room Types for the Hotel */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Room Types</Typography>
                        <RoomTypes hotelId={hotel.id} />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography>No hotels available.</Typography>
                )}
              </Box>
            </ThemeProvider>
          </div>
        </div>
      }
    </div>
  );
}

const RoomTypeForm = ({ hotelId, handleAddRoomType }) => {
    const [roomTypePrice, setRoomTypePrice] = useState('');
    const [roomTypeTotalRooms, setRoomTypeTotalRooms] = useState('');
    const [roomTypeAmenities, setRoomTypeAmenities] = useState('');
    const [roomTypeType, setRoomTypeType] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const roomTypeData = {
        type: roomTypeType,
        totalRooms: roomTypeTotalRooms,
        amenities: roomTypeAmenities.split(','), // Assuming amenities is a comma-separated string
        pricePerNight: roomTypePrice,
      };
      handleAddRoomType(hotelId, roomTypeData);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Room Type"
              fullWidth
              value={roomTypeType}
              onChange={(e) => setRoomTypeType(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Rooms"
              fullWidth
              value={roomTypeTotalRooms}
              onChange={(e) => setRoomTypeTotalRooms(e.target.value)}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amenities (comma separated)"
              fullWidth
              value={roomTypeAmenities}
              onChange={(e) => setRoomTypeAmenities(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price per Night"
              fullWidth
              value={roomTypePrice}
              onChange={(e) => setRoomTypePrice(e.target.value)}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
            >
              Add Room Type
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };
  const RoomTypes = ({ hotelId }) => {
    const [roomTypes, setRoomTypes] = useState([]);
  
    useEffect(() => {
      const fetchRoomTypes = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}/roomTypes`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          const data = await response.json();
          setRoomTypes(data);
        } catch (error) {
          console.error('Error fetching room types:', error);
        }
      };
  
      fetchRoomTypes();
    }, [hotelId]);
  
    return (
      <Box sx={{ mt: 2 }}>
        {roomTypes.length > 0 ? (
          roomTypes.map((roomType) => (
            <Box key={roomType.id} sx={{ mb: 2 }}>
              <Typography variant="body1">Type: {roomType.type}</Typography>
              <Typography variant="body2">Total Rooms: {roomType.totalRooms}</Typography>
              <Typography variant="body2">Price per night: ${roomType.pricePerNight}</Typography>
              <Typography variant="body2">Amenities: {roomType.amenities.join(', ')}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No room types available for this hotel.</Typography>
        )}
      </Box>
    );
  };
  
  