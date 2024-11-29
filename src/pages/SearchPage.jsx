import React, { useState } from "react";
import NavHeader from "../components/navbar/NavHeader";
import SearchInput from "../components/search/SearchInput"; 
import { ThemeProvider, createTheme } from '@mui/material';
import TourListComponent from "../components/tourCard/TourListComponent";

function SearchPage() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  const [searchParams, setSearchParams] = useState({});

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-50">
        <NavHeader textColor='black' />
        <div>
          <div className="flex">
            {/* Search Section - Left Side */}
            <div className="w-1/6">
              <div className="bg-white p-4 rounded-lg shadow sticky top-24">
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>
            
            {/* Tour List Section - Right Side */}
            <div className="w-5/6">
              <TourListComponent searchParams={searchParams} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SearchPage;