'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';

const PropertyCard2 = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  // Handle both old and new schema
  const propertyName = property.title || property.name;
  const propertyType = property.propertyType || property.type;
  const bathrooms = property.bathrooms || property.baths;
  const locationCity = property.location?.area || property.location?.city;
  const locationState = property.location?.state;
  
  // Handle pricing - support both old (rates) and new (basePricePerNight) schema
  const pricePerNight = property.basePricePerNight || property.rates?.nightly;
  const pricePerWeek = property.rates?.weekly;
  const pricePerMonth = property.rates?.monthly;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden'>
      <div className='flex flex-col lg:flex-row'>
        {/* Property Image Carousel */}
        <div className='relative lg:w-80 h-64 lg:h-auto flex-shrink-0 group'>
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex]}
              alt={`${propertyName} - Image ${currentImageIndex + 1}`}
              fill
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400'>
              <FaBed className='text-6xl' />
            </div>
          )}
          
          {/* Badges */}
          <div className='absolute top-4 left-4 flex gap-2'>
            {propertyType && (
              <span className='px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-900 text-white shadow-sm'>
                {propertyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <FavoriteButton property={property} />

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                aria-label='Previous image'
              >
                <FaChevronLeft className='text-gray-700 text-sm' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                aria-label='Next image'
              >
                <FaChevronRight className='text-gray-700 text-sm' />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 0 && (
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
              {images.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goToImage(i, e)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
              {images.length > 5 && (
                <span className='text-white text-xs font-semibold ml-1'>
                  +{images.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className='flex-1 p-6 lg:p-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between h-full'>
            {/* Left Side - Details */}
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {propertyName}
              </h2>

              {/* Location */}
              <div className='flex items-center gap-2 text-gray-600 mb-4'>
                <FaMapMarkerAlt className='text-sm' />
                <span className='text-sm'>
                  {locationCity}
                  {locationState && `, ${locationState}`}
                  {property.location?.landmark && ` - Near ${property.location.landmark}`}
                </span>
              </div>

              {/* Room Details */}
              <div className='flex flex-wrap gap-4 mb-4 text-sm text-gray-700'>
                <span className='flex items-center gap-1.5'>
                  <FaBed className='text-blue-500' />
                  {property.beds} Beds
                </span>
                <span className='text-gray-300'>•</span>
                <span className='flex items-center gap-1.5'>
                  <FaBath className='text-blue-500' />
                  {bathrooms} Baths
                </span>
                {property.square_feet && (
                  <>
                    <span className='text-gray-300'>•</span>
                    <span className='flex items-center gap-1.5'>
                      <FaRulerCombined className='text-blue-500' />
                      {property.square_feet} sqft
                    </span>
                  </>
                )}
                {property.maxGuests && (
                  <>
                    <span className='text-gray-300'>•</span>
                    <span className='flex items-center gap-1.5'>
                      👥 {property.maxGuests} Guests
                    </span>
                  </>
                )}
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className='flex flex-wrap gap-3 mb-4'>
                  {property.amenities.slice(0, 5).map((amenity, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 5 && (
                    <span className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'>
                      +{property.amenities.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {property.description}
                </p>
              )}
            </div>

            {/* Right Side - Price & Action */}
            <div className='lg:ml-8 mt-6 lg:mt-0 flex flex-col items-end'>
              <div className='text-right mb-4'>
                <div className='text-3xl font-bold text-gray-900 mb-1'>
                  {pricePerNight ? (
                    `₱${pricePerNight.toLocaleString()}`
                  ) : pricePerWeek ? (
                    `₱${pricePerWeek.toLocaleString()}`
                  ) : pricePerMonth ? (
                    `₱${pricePerMonth.toLocaleString()}`
                  ) : (
                    'Contact for rates'
                  )}
                </div>
                <div className='text-xs text-gray-500'>
                  {pricePerNight && 'Per Night'}
                  {pricePerWeek && !pricePerNight && 'Per Week'}
                  {pricePerMonth && !pricePerNight && !pricePerWeek && 'Per Month'}
                </div>
              </div>

              <Link
                href={`/listings/${property._id}`}
                className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
              >
                View Details
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard2;