'use client';

import { Box, Button, TextField, Typography, IconButton, Slider, Rating } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./searchbar";

function HotelSearchBar() {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [starRating, setStarRating] = useState<number | null>(0);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const handleSearch = (baseParams: URLSearchParams) => {
    const searchPath = `/hotels/search?${baseParams.toString()}`;
    
    // Add our hotel-specific filters
    const finalParams = new URLSearchParams(baseParams);
    if (starRating) {
      finalParams.set('rating', starRating.toString());
    }
    finalParams.set('minPrice', priceRange[0].toString());
    finalParams.set('maxPrice', priceRange[1].toString());

    router.push(`/hotels/search?${finalParams.toString()}`);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <LocationOnIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <DateRangeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Select dates"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="2 travelers, 1 room"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-medium text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-base flex items-center gap-2"
        >
          {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {isFiltersOpen && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography className="text-base font-semibold text-gray-900 mb-3">
                  Star Rating
                </Typography>
                <Rating
                  value={starRating}
                  onChange={(_, newValue) => setStarRating(newValue)}
                  size="large"
                  className="text-blue-600"
                />
              </div>
              
              <div>
                <Typography className="text-base font-semibold text-gray-900 mb-3">
                  Price Range
                </Typography>
                <Box sx={{ width: '100%', px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={50}
                    marks={[
                      { value: 0, label: '$0' },
                      { value: 500, label: '$500' },
                      { value: 1000, label: '$1000' },
                    ]}
                    className="text-blue-600"
                  />
                </Box>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => handleSearch(new URLSearchParams())}
        className="absolute right-4 top-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
      >
        Search
      </button>
    </div>
  );
}

export default HotelSearchBar;
