import React from "react";
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

  const handleSearch = (params) => {
    navigate("/tour-list", { state: { searchParams: params } });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-50">
        <NavHeader textColor='black' />
        <div>
          <div className="flex">
            {/* Search Section - Left Side with reduced width */}
            <div className="w-1/6">
              <div className="bg-white p-4 rounded-lg shadow sticky top-24">
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>
            
            {/* Tour List Section - Right Side with increased width */}
            <div className="w-5/6">
              <TourListComponent />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SearchPage;