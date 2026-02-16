'use client';
import { useState } from 'react';
import Image from 'next/image';
import updateProperty from '@/app/actions/updateProperty';
import { FaTimes, FaGripVertical } from 'react-icons/fa';
import { filterConfig } from '@/config/constant';

const PropertyEditForm = ({ property }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle both old and new schema for default values
  const propertyType = property.propertyType || property.type;
  const propertyTitle = property.title || property.name;
  const bathrooms = property.bathrooms || property.baths;
  const locationArea = property.location?.area || property.location?.city;
  const basePricePerNight = property.basePricePerNight || property.rates?.nightly;

  // State for managing images
  const [existingImages, setExistingImages] = useState(property.images || []);
  const [newImages, setNewImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const updatePropertyById = updateProperty.bind(null, property._id);

    try {
      await updatePropertyById(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Remove new image
  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Handle new image uploads
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  // Drag and drop handlers for existing images
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.target.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newArray = [...existingImages];
    const draggedItem = newArray[draggedIndex];

    // Remove from old position
    newArray.splice(draggedIndex, 1);

    // Insert at new position
    newArray.splice(dropIndex, 0, draggedItem);

    setExistingImages(newArray);
    setDraggedIndex(null);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      e.currentTarget.style.borderColor = '#3b82f6';
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = '#d1d5db';
  };

  return (
    <div className="relative mx-auto">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900">Updating your listing</p>
            <p className="text-sm text-gray-500 mt-1">Please wait...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2 className='text-3xl text-center font-semibold mb-6'>Edit Property</h2>

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
            defaultValue={propertyType}
          >
            {filterConfig.propertyTypes.map((propertyType) => (
              <option key={propertyType.id} value={propertyType.id}>{propertyType.label}</option>
            ))}
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
              defaultValue={propertyTitle}
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
              defaultValue={property.description}
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
                defaultValue={locationArea}
              >
                {filterConfig.locations.map((location) => (
                  <option key={location.id} value={location.label}>
                    {location.label}
                  </option>
                ))}
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
                defaultValue={property.location?.street}
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
                defaultValue={property.location?.landmark}
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
                defaultValue={property.maxGuests || 1}
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
                defaultValue={property.bedrooms || 0}
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
                defaultValue={property.beds}
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
                defaultValue={bathrooms}
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
                defaultValue={basePricePerNight}
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
            {filterConfig.amenities.map((amenity) => (
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
              defaultValue={property.houseRules}
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
                defaultValue={property.checkInTime || '14:00'}
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
                defaultValue={property.checkOutTime || '12:00'}
              />
            </div>
          </div>
        </div>

        {/* Image Management Section with Drag & Drop */}
        <div className="mb-4 space-y-6 pt-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3">
            Property Images
          </h3>

          {/* Existing Images - Draggable */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Current Images (Drag to reorder)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    className="relative group cursor-move transition-all"
                  >
                    <div className="relative w-full h-32 rounded overflow-hidden border-2 border-gray-300 transition-all">
                      <Image
                        src={image}
                        alt={`Property ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* Drag Handle Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <FaGripVertical className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors z-10"
                      title="Remove image"
                    >
                      <FaTimes size={12} />
                    </button>

                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-semibold">
                      {index + 1}
                    </div>

                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded font-semibold">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Drag and drop images to reorder. The first image will be the main thumbnail.
              </p>
            </div>
          )}

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">New Images to Upload</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded overflow-hidden border-2 border-green-500">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                      title="Remove image"
                    >
                      <FaTimes size={12} />
                    </button>

                    {/* New Badge */}
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
                      NEW
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="space-y-3">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Add More Images
            </label>
            <input
              type="file"
              id="images"
              onChange={handleNewImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-white focus:outline-none file:mr-4 file:py-3 file:px-6 file:border-0 file:border-r file:border-gray-300 file:bg-gray-50 file:text-gray-900 file:font-medium hover:file:bg-gray-100 file:cursor-pointer transition-all"
              accept="image/*"
              multiple
            />
            <p className="text-sm text-gray-600">
              Total images: {existingImages.length + newImages.length}
            </p>
          </div>

          {/* Hidden inputs to pass existing images in order */}
          {existingImages.map((image, index) => (
            <input
              key={index}
              type="hidden"
              name="existingImages"
              value={image}
            />
          ))}
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
                Updating...
              </span>
            ) : (
              'Update Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditForm;