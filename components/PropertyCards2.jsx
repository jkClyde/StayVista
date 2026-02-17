'use client';

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
  FaCalendarAlt,
} from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';

const PropertyCard2 = ({ property, checkIn = '', checkOut = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  // ── Schema compatibility ─────────────────────────────────────────────────
  const propertyName  = property.title || property.name;
  const propertyType  = property.propertyType || property.type;
  const bathrooms     = property.bathrooms || property.baths;
  const locationCity  = property.location?.area || property.location?.city;
  const locationState = property.location?.state;
  const pricePerNight = property.basePricePerNight || property.rates?.nightly;

  // ── Date calculation ─────────────────────────────────────────────────────
  const hasDateRange = Boolean(checkIn && checkOut);
  let totalNights = 0;
  let totalPrice  = null;

  if (hasDateRange && pricePerNight) {
    const msPerDay  = 1000 * 60 * 60 * 24;
    totalNights     = Math.ceil((new Date(checkOut) - new Date(checkIn)) / msPerDay);
    totalPrice      = totalNights > 0 ? totalNights * pricePerNight : null;
  }

  // ── Link: pass dates along so the listing page can pre-fill the form ─────
  const dateQuery =
    hasDateRange ? `?checkIn=${checkIn}&checkOut=${checkOut}` : '';
  const listingHref = `/listings/${property._id}${dateQuery}`;

  // ── Carousel helpers ─────────────────────────────────────────────────────
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

        {/* ── Image carousel ────────────────────────────────────────────── */}
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

          {/* Property type badge */}
          <div className='absolute top-4 left-4 flex gap-2'>
            {propertyType && (
              <span className='px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-900 text-white shadow-sm'>
                {propertyType
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            )}
          </div>

          <FavoriteButton property={property} />

          {/* Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              >
                <FaChevronLeft className='text-gray-700 text-sm' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              >
                <FaChevronRight className='text-gray-700 text-sm' />
              </button>
            </>
          )}

          {/* Dot indicators */}
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

        {/* ── Property details ───────────────────────────────────────────── */}
        <div className='flex-1 p-6 lg:p-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between h-full'>

            {/* Left side */}
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {propertyName}
              </h2>

              <div className='flex items-center gap-2 text-gray-600 mb-4'>
                <FaMapMarkerAlt className='text-sm' />
                <span className='text-sm'>
                  {locationCity}
                  {locationState && `, ${locationState}`}
                  {property.location?.landmark &&
                    ` - Near ${property.location.landmark}`}
                </span>
              </div>

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

              {property.description && (
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {property.description}
                </p>
              )}

              {/* ── Date-range summary (only shown when dates are selected) ── */}
              {hasDateRange && totalNights > 0 && (
                <div className='mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700'>
                  <FaCalendarAlt className='text-blue-400 text-xs' />
                  <span>
                    {new Date(checkIn).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    →{' '}
                    {new Date(checkOut).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className='text-blue-400'>·</span>
                  <span>
                    {totalNights} night{totalNights > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Right side – price + CTA */}
            <div className='lg:ml-8 mt-6 lg:mt-0 flex lg:flex-col items-center lg:items-end justify-between gap-4'>
              <div className='text-right'>
                {/* Per-night rate */}
                <div className='text-3xl font-bold text-gray-900 mb-0.5'>
                  {pricePerNight
                    ? `₱${pricePerNight.toLocaleString()}`
                    : 'Contact for rates'}
                </div>
                <div className='text-xs text-gray-500 mb-1'>
                  {pricePerNight && 'per night'}
                </div>

                {/* Total when dates are selected */}
                {totalPrice !== null && totalNights > 0 && (
                  <div className='text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200'>
                    ₱{totalPrice.toLocaleString()}
                    <span className='font-normal text-gray-500'>
                      {' '}
                      total
                    </span>
                  </div>
                )}
              </div>

              <Link
                href={listingHref}
                className='inline-flex items-center justify-center gap-2 px-4 md:px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md whitespace-nowrap'
              >
                {hasDateRange ? 'Book Now' : 'View Details'}
                <span className='hidden md:block'>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard2;