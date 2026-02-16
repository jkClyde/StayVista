'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronDown, FaChevronUp, FaTimes, FaFilter } from 'react-icons/fa';

const PropertyFilters = ({ initialFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    bedrooms: initialFilters?.bedrooms || 0,
    amenities: initialFilters?.amenities || [],
    propertyType: initialFilters?.propertyType || [],
    location: initialFilters?.location || [],
  });

  const [expandedSections, setExpandedSections] = useState({
    amenities: true,
    propertyType: true,
    location: true,
  });

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Update URL when filters change (but skip initial mount)
  useEffect(() => {
    // Create a unique key from current filters to compare
    const filtersKey = JSON.stringify(filters);
    const initialFiltersKey = JSON.stringify({
      minPrice: initialFilters?.minPrice || '',
      maxPrice: initialFilters?.maxPrice || '',
      bedrooms: initialFilters?.bedrooms || 0,
      amenities: initialFilters?.amenities || [],
      propertyType: initialFilters?.propertyType || [],
      location: initialFilters?.location || [],
    });

    // Skip if filters haven't actually changed from initial
    if (filtersKey === initialFiltersKey) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    
    // Remove old filter params
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('bedrooms');
    params.delete('amenities');
    params.delete('propertyType');
    params.delete('location');
    
    // Add new filter params
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms > 0) params.set('bedrooms', filters.bedrooms);
    if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
    if (filters.propertyType.length > 0) params.set('propertyType', filters.propertyType.join(','));
    if (filters.location.length > 0) params.set('location', filters.location.join(','));

    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [filters, router, searchParams, initialFilters]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === '' ? '' : Number(value),
    }));
  };

  const handleBedroomChange = (increment) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: Math.max(0, prev.bedrooms + increment),
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handlePropertyTypeToggle = (typeId) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(typeId)
        ? prev.propertyType.filter((id) => id !== typeId)
        : [...prev.propertyType, typeId],
    }));
  };

  const handleLocationToggle = (locationId) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location.includes(locationId)
        ? prev.location.filter((id) => id !== locationId)
        : [...prev.location, locationId],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: 0,
      amenities: [],
      propertyType: [],
      location: [],
    });
  };

  const hasActiveFilters =
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.bedrooms > 0 ||
    filters.amenities.length > 0 ||
    filters.propertyType.length > 0 ||
    filters.location.length > 0;

  const activeFilterCount = 
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.propertyType.length > 0 ? 1 : 0) +
    (filters.location.length > 0 ? 1 : 0);

  const displayedAmenities = showAllAmenities
    ? availableAmenities
    : availableAmenities.filter((a) => a.popular);

  const FilterContent = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
        <h2 className='text-lg font-bold text-gray-900'>Filters</h2>
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto'>
        <div className='p-6'>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className='lg:hidden fixed bottom-6 right-6 z-40'>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className='flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl'
        >
          <FaFilter className='text-sm' />
          <span className='font-medium'>Filters</span>
          {activeFilterCount > 0 && (
            <span className='ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full'>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300'
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Drawer Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl z-10'>
          <div className='flex items-center justify-between p-4'>
            <h2 className='text-xl font-bold text-gray-900'>Filters</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            >
              <FaTimes className='text-gray-600 text-xl' />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className='overflow-y-auto p-6' style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <FilterContent />
        </div>

        {/* Drawer Footer */}
        <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4'>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className='w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200'
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertyFilters;