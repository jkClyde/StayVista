'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PropertyFilters = ({ initialFilters = {} }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    bedrooms: initialFilters.bedrooms || 0,
    amenities: initialFilters.amenities || [],
    propertyType: initialFilters.propertyType || [],
    location: initialFilters.location || [],
  });

  const [expandedSections, setExpandedSections] = useState({
    amenities: true,
    propertyType: true,
    location: true,
  });

  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const availableAmenities = [
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
  ];

  const propertyTypes = [
    { id: 'entire_place', label: 'Entire Place' },
    { id: 'private_room', label: 'Private Room' },
    { id: 'bedspace', label: 'Bedspace' },
  ];

  const locations = [
    { id: 'Baguio City', label: 'Baguio City' },
    { id: 'La Trinidad', label: 'La Trinidad' },
    { id: 'Itogon', label: 'Itogon' },
    { id: 'Sablan', label: 'Sablan' },
    { id: 'Tuba', label: 'Tuba' },
    { id: 'Tublay', label: 'Tublay' },
  ];

  // Debounce timer for price inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(filters);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters.minPrice, filters.maxPrice]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    
    // Always reset to page 1 when filters change
    params.set('page', '1');

    // Add all filter params
    if (newFilters.minPrice && newFilters.minPrice !== '') {
      params.set('minPrice', String(newFilters.minPrice));
    }

    if (newFilters.maxPrice && newFilters.maxPrice !== '') {
      params.set('maxPrice', String(newFilters.maxPrice));
    }

    if (newFilters.bedrooms && newFilters.bedrooms > 0) {
      params.set('bedrooms', String(newFilters.bedrooms));
    }

    if (newFilters.amenities && newFilters.amenities.length > 0) {
      params.set('amenities', newFilters.amenities.join(','));
    }

    if (newFilters.propertyType && newFilters.propertyType.length > 0) {
      params.set('propertyType', newFilters.propertyType.join(','));
    }

    if (newFilters.location && newFilters.location.length > 0) {
      params.set('location', newFilters.location.join(','));
    }

    // Use startTransition for smoother updates
    startTransition(() => {
      router.replace(`/properties?${params.toString()}`);
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === '' ? '' : value,
    }));
  };

  const handleBedroomChange = (increment) => {
    const newFilters = {
      ...filters,
      bedrooms: Math.max(0, filters.bedrooms + increment),
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleAmenityToggle = (amenityId) => {
    const newFilters = {
      ...filters,
      amenities: filters.amenities.includes(amenityId)
        ? filters.amenities.filter((id) => id !== amenityId)
        : [...filters.amenities, amenityId],
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePropertyTypeToggle = (typeId) => {
    const newFilters = {
      ...filters,
      propertyType: filters.propertyType.includes(typeId)
        ? filters.propertyType.filter((id) => id !== typeId)
        : [...filters.propertyType, typeId],
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleLocationToggle = (locationId) => {
    const newFilters = {
      ...filters,
      location: filters.location.includes(locationId)
        ? filters.location.filter((id) => id !== locationId)
        : [...filters.location, locationId],
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      bedrooms: 0,
      amenities: [],
      propertyType: [],
      location: [],
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.bedrooms > 0 ||
    filters.amenities.length > 0 ||
    filters.propertyType.length > 0 ||
    filters.location.length > 0;

  const displayedAmenities = showAllAmenities
    ? availableAmenities
    : availableAmenities.filter((a) => a.popular);

  return (
    <aside className='hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto'>
      <div className='p-6 space-y-6'>
        <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
          <h2 className='text-lg font-bold text-gray-900'>
            Filters {isPending && <span className='text-xs text-gray-500'>(updating...)</span>}
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'
            >
              Clear All
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className='border-b border-gray-200 pb-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>Price Range</h3>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-gray-600 mb-1 block'>Min Price</label>
              <input
                type='number'
                placeholder='₱999'
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='text-xs text-gray-600 mb-1 block'>Max Price</label>
              <input
                type='number'
                placeholder='₱10000'
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className='border-b border-gray-200 pb-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>Bedrooms</h3>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-700'>Min Bedrooms</span>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => handleBedroomChange(-1)}
                disabled={filters.bedrooms === 0}
                className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                -
              </button>
              <span className='text-sm font-medium w-8 text-center'>
                {filters.bedrooms === 0 ? 'Any' : `${filters.bedrooms}+`}
              </span>
              <button
                onClick={() => handleBedroomChange(1)}
                className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors'
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className='border-b border-gray-200 pb-6'>
          <button
            onClick={() => toggleSection('propertyType')}
            className='flex items-center justify-between w-full mb-4 hover:text-gray-600 transition-colors'
          >
            <h3 className='font-semibold text-gray-900'>Property Type</h3>
            {expandedSections.propertyType ? (
              <FaChevronUp className='text-gray-600' />
            ) : (
              <FaChevronDown className='text-gray-600' />
            )}
          </button>
          {expandedSections.propertyType && (
            <div className='space-y-3'>
              {propertyTypes.map((type) => (
                <label key={type.id} className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    checked={filters.propertyType.includes(type.id)}
                    onChange={() => handlePropertyTypeToggle(type.id)}
                    className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                  />
                  <span className='text-sm text-gray-700 ml-2 group-hover:text-gray-900 transition-colors'>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div className='border-b border-gray-200 pb-6'>
          <button
            onClick={() => toggleSection('location')}
            className='flex items-center justify-between w-full mb-4 hover:text-gray-600 transition-colors'
          >
            <h3 className='font-semibold text-gray-900'>Location</h3>
            {expandedSections.location ? (
              <FaChevronUp className='text-gray-600' />
            ) : (
              <FaChevronDown className='text-gray-600' />
            )}
          </button>
          {expandedSections.location && (
            <div className='space-y-3'>
              {locations.map((location) => (
                <label key={location.id} className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    checked={filters.location.includes(location.id)}
                    onChange={() => handleLocationToggle(location.id)}
                    className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                  />
                  <span className='text-sm text-gray-700 ml-2 group-hover:text-gray-900 transition-colors'>
                    {location.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className='pb-6'>
          <button
            onClick={() => toggleSection('amenities')}
            className='flex items-center justify-between w-full mb-4 hover:text-gray-600 transition-colors'
          >
            <h3 className='font-semibold text-gray-900'>Amenities</h3>
            {expandedSections.amenities ? (
              <FaChevronUp className='text-gray-600' />
            ) : (
              <FaChevronDown className='text-gray-600' />
            )}
          </button>
          {expandedSections.amenities && (
            <div className='space-y-3'>
              {displayedAmenities.map((amenity) => (
                <label key={amenity.id} className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    checked={filters.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                  />
                  <span className='text-sm text-gray-700 ml-2 group-hover:text-gray-900 transition-colors'>
                    {amenity.label}
                  </span>
                </label>
              ))}
              <button
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className='text-sm text-blue-600 hover:underline font-medium transition-colors'
              >
                {showAllAmenities ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>

        {/* Debug Info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className='bg-gray-100 p-3 rounded text-xs'>
            <div className='font-semibold mb-1'>Active Filters:</div>
            <pre className='overflow-auto'>{JSON.stringify(filters, null, 2)}</pre>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PropertyFilters;