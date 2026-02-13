'use client';
import { useState } from 'react';
import addProperty from '@/app/actions/addProperty';

const PropertyAddForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await addProperty(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative  mx-auto">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900">Processing your listing</p>
            <p className="text-sm text-gray-500 mt-1">Please wait...</p>
          </div>
        </div>
      )}

      <form action={handleSubmit}>
        <h2 className='text-3xl text-center font-semibold mb-6'>Add Property</h2>

        {/* Property Type */}
        <div className="mb-4 space-y-3">
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
            required
          >
            <option value="entire_place">Entire Place</option>
            <option value="private_room">Private Room</option>
            <option value="bedspace">Bedspace</option>
          </select>
        </div>

        {/* Basic Information */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Basic Information
          </h3>
          
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Property Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
              placeholder="e.g., Modern Studio in Baguio City"
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all resize-none"
              rows="4"
              placeholder="Describe your property and what makes it special..."
            ></textarea>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Location Details
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <select
                id="area"
                name="location.area"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                required
              >
                <option value="">Select Area</option>
                <option value="Baguio City">Baguio City</option>
                <option value="La Trinidad">La Trinidad</option>
                <option value="Itogon">Itogon</option>
                <option value="Sablan">Sablan</option>
                <option value="Tuba">Tuba</option>
                <option value="Tublay">Tublay</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="street"
                name="location.street"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                placeholder="Street address"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                Nearby Landmark <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="landmark"
                name="location.landmark"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                placeholder="Landmark"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Property Specifications
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-3">
              <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                Max Guests
              </label>
              <input
                type="number"
                id="maxGuests"
                name="maxGuests"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                min="0"
                defaultValue="0"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
                Beds
              </label>
              <input
                type="number"
                id="beds"
                name="beds"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                min="1"
                step="0.5"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Pricing
          </h3>
          
          <div className="space-y-3 max-w-md">
            <label htmlFor="basePricePerNight" className="block text-sm font-medium text-gray-700">
              Base Price Per Night
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₱</span>
              <input
                type="number"
                id="basePricePerNight"
                name="basePricePerNight"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Amenities
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'wifi', label: 'Wifi' },
              { id: 'kitchen', label: 'Full kitchen' },
              { id: 'washer_dryer', label: 'Washer & Dryer' },
              { id: 'free_parking', label: 'Free Parking' },
              { id: 'pool', label: 'Swimming Pool' },
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
            ].map((amenity) => (
              <label
                key={amenity.id}
                htmlFor={`amenity_${amenity.id}`}
                className="flex items-center px-4 py-3 border border-gray-300 bg-white cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-all group"
              >
                <input
                  type="checkbox"
                  id={`amenity_${amenity.id}`}
                  name="amenities"
                  value={amenity.label}
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-1 focus:ring-gray-900 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            House Rules
          </h3>
          
          <div className="space-y-3">
            <textarea
              id="houseRules"
              name="houseRules"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all resize-none"
              rows="4"
              placeholder="No smoking, No pets, Quiet hours after 10 PM..."
            ></textarea>
          </div>
        </div>

        {/* Check-in/Check-out */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Check-in & Check-out
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">
                Check-in Time
              </label>
              <input
                type="time"
                id="checkInTime"
                name="checkInTime"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                defaultValue="14:00"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">
                Check-out Time
              </label>
              <input
                type="time"
                id="checkOutTime"
                name="checkOutTime"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                defaultValue="12:00"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Property Images
          </h3>
          
          <div className="space-y-3">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Upload Images <span className="text-gray-500 font-normal">(Maximum 4)</span>
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-white focus:outline-none file:mr-4 file:py-3 file:px-6 file:border-0 file:border-r file:border-gray-300 file:bg-gray-50 file:text-gray-900 file:font-medium hover:file:bg-gray-100 file:cursor-pointer transition-all"
              accept="image/*"
              multiple
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Add Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyAddForm;