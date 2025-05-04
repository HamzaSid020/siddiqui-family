import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Chip } from '@mui/material';
import { Person, LocationOn } from '@mui/icons-material';
import locationData from '../data/locations.json';

const PAKISTAN_MAP_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag-map_of_Pakistan.svg/1200px-Flag-map_of_Pakistan.svg.png';

// Updated coordinates with more precise positioning
const LOCATION_COORDINATES = {
  // Pakistan Locations
  'Karachi': { x: 65, y: 85 },
  'FB Area': { x: 65, y: 85 },
  'Gulshan-e-Iqbal': { x: 67, y: 85 },
  'PECHS': { x: 66, y: 85 },
  'Bufferzone': { x: 64, y: 85 },
  'Malir 15': { x: 68, y: 85 },
  'Lahore': { x: 75, y: 35 },
  'Airport Road': { x: 75, y: 35 },
  'Islamabad': { x: 80, y: 25 },
  
  // USA Locations
  'Monmouth Junction': { x: 15, y: 30 },
  'Edison': { x: 15, y: 30 },
  'Hendersonville': { x: 10, y: 35 },
  'Denton': { x: 5, y: 40 },
  
  // Canada Locations
  'Scarborough': { x: 20, y: 20 },
  'Mississauga': { x: 20, y: 20 },
  'Toronto': { x: 20, y: 20 },
  
  // India Locations
  'Lucknow': { x: 85, y: 35 }
};

const FamilyMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Group members by city and area
    const groupedLocations = locationData.reduce((acc, curr) => {
      const key = `${curr.city}, ${curr.area}`;
      if (!acc[key]) {
        acc[key] = {
          city: curr.city,
          area: curr.area,
          country: curr.country,
          members: []
        };
      }
      acc[key].members.push(curr);
      return acc;
    }, {});

    setLocations(Object.values(groupedLocations));
  }, []);

  const getLocationCoordinates = (city, area) => {
    // First try to find exact area match
    for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (area.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }
    // If no area match, try city match
    for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (city.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }
    return { x: 50, y: 50 }; // Default center if location not found
  };

  const getMarkerColor = (country) => {
    switch (country) {
      case 'Pakistan':
        return '#1E88E5'; // Blue
      case 'USA':
        return '#43A047'; // Green
      case 'Canada':
        return '#E53935'; // Red
      case 'India':
        return '#FFA000'; // Orange
      default:
        return '#757575'; // Grey
    }
  };

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Family Members by Location
      </Typography>
      <Box sx={{ position: 'relative', height: '600px', width: '100%' }}>
        <img 
          src={PAKISTAN_MAP_URL} 
          alt="Pakistan Map" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
        />
        {locations.map((location, index) => {
          const coords = getLocationCoordinates(location.city, location.area);
          return (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 1
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <Paper
                elevation={3}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: getMarkerColor(location.country),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    transition: 'all 0.2s'
                  }
                }}
              />
            </Box>
          );
        })}
      </Box>

      {selectedLocation && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 2,
            maxWidth: 300,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ mr: 1, color: getMarkerColor(selectedLocation.country) }} />
            <Typography variant="subtitle1">
              {selectedLocation.area}, {selectedLocation.city}
              {selectedLocation.country && (
                <Chip 
                  label={selectedLocation.country}
                  size="small"
                  sx={{ 
                    ml: 1,
                    bgcolor: getMarkerColor(selectedLocation.country),
                    color: 'white'
                  }}
                />
              )}
            </Typography>
          </Box>
          <List dense>
            {selectedLocation.members.map((member, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={`${selectedLocation.area}, ${selectedLocation.city}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Card>
  );
};

export default FamilyMap; 