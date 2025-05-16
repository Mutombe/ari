import React, { useState } from 'react';
import { 
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

// Map of country names to their flag emojis and brand names
const countryData = {
    Uganda: { flag: "🇺🇬", brand: "UG-REC" },
    Zambia: { flag: "🇿🇲", brand: "ZAM-REC" },
    Malawi: { flag: "🇲🇼", brand: "MALAWI-REC" },
    Namibia: { flag: "🇳🇦", brand: "NAM-REC" },
    Lesotho: { flag: "🇱🇸", brand: "LESOTHO-RECs" },
    //"Eswatini": { flag: "🇸🇿", brand: "Eswarec" },
    Angola: { flag: "🇦🇴", brand: "ANGOLA-REC" },
    DRC: { flag: "🇨🇩", brand: "CONGO-REC" },
};

const CountrySelector = ({ selectedCountry, onSelectCountry }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleCountrySelect = (country) => {
    onSelectCountry(country);
    handleClose();
  };
  
  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<ChevronDown className="h-4 w-4" />}
        className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !py-3 !text-base !font-semibold !w-full"
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <span className="mr-2">{countryData[selectedCountry].flag}</span>
            <span>Register with {countryData[selectedCountry].brand}</span>
          </div>
        ) : (
          "Select Country & Register"
        )}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '100%',
            maxWidth: '360px'
          }
        }}
      >
        {Object.keys(countryData).map((country) => (
          <MenuItem 
            key={country} 
            onClick={() => handleCountrySelect(country)}
            selected={country === selectedCountry}
          >
            <ListItemIcon className="min-w-8">
              <Typography variant="h6" className="text-xl">
                {countryData[country].flag}
              </Typography>
            </ListItemIcon>
            <ListItemText>
              {country} ({countryData[country].brand})
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CountrySelector;