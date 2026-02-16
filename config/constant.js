// Filter configuration data
export const filterConfig = {
  amenities: [
    { id: 'wifi', label: 'WiFi', popular: true },
    { id: 'kitchen', label: 'Full Kitchen', popular: true },
    { id: 'pool', label: 'Swimming Pool', popular: true },
    { id: 'free_parking', label: 'Free Parking', popular: true },
    { id: 'washer_dryer', label: 'Washer & Dryer' },
    { id: 'hot_tub', label: 'Hot Tub' },
    { id: '24_7_security', label: '24/7 Security' },
    { id: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
    { id: 'elevator_access', label: 'Elevator Access' },
    { id: 'dishwasher', label: 'Dishwasher' },
    { id: 'gym_fitness_center', label: 'Gym/Fitness Center' },
    { id: 'air_conditioning', label: 'Air Conditioning' },
    { id: 'balcony_patio', label: 'Balcony/Patio' },
    { id: 'smart_tv', label: 'Smart TV' },
    { id: 'coffee_maker', label: 'Coffee Maker' },
  ],

  propertyTypes: [
    { id: 'entire_place', label: 'Entire Place' },
    { id: 'private_room', label: 'Private Room' },
    { id: 'bedspace', label: 'Bedspace' },
  ],

  locations: [
    { id: 'Baguio City', label: 'Baguio City' },
    { id: 'La Trinidad', label: 'La Trinidad' },
    { id: 'Itogon', label: 'Itogon' },
    { id: 'Sablan', label: 'Sablan' },
    { id: 'Tuba', label: 'Tuba' },
    { id: 'Tublay', label: 'Tublay' },
        { id: 'Kapangan', label: 'Kapangan' },

  ],
};

// Helper function to get popular amenities
export const getPopularAmenities = () => {
  return filterConfig.amenities.filter((amenity) => amenity.popular);
};

// Helper function to get all amenities
export const getAllAmenities = () => {
  return filterConfig.amenities;
};

// Helper function to get amenity by ID
export const getAmenityById = (id) => {
  return filterConfig.amenities.find((amenity) => amenity.id === id);
};

// Helper function to get property type by ID
export const getPropertyTypeById = (id) => {
  return filterConfig.propertyTypes.find((type) => type.id === id);
};

// Helper function to get location by ID
export const getLocationById = (id) => {
  return filterConfig.locations.find((location) => location.id === id);
};