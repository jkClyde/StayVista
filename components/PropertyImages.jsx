'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PropertyImages = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative aspect-[4/3] bg-gray-200 rounded-t-xl overflow-hidden group'>
        <Image
          src={images[currentImageIndex]}
          alt={`Property image ${currentImageIndex + 1}`}
          fill
          className='object-cover'
          priority={currentImageIndex === 0}
        />
        
        {/* Image Counter */}
        <div className='absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium'>
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              aria-label='Previous image'
            >
              <FaChevronLeft className='text-gray-800' />
            </button>
            <button
              onClick={nextImage}
              className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              aria-label='Next image'
            >
              <FaChevronRight className='text-gray-800' />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-2 px-4 pb-4'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-[#1A1E43] ring-2 ring-[#1A1E43] ring-offset-2'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;