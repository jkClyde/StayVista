import Image from 'next/image';
import Link from 'next/link';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaRegHeart,
} from 'react-icons/fa';

const PropertyCard2 = ({ property }) => {
  return (
    <div className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden'>
      <div className='flex flex-col lg:flex-row'>
        {/* Property Image */}
        <div className='relative lg:w-80 h-64 lg:h-auto flex-shrink-0'>
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.name}
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
            {property.type && (
              <span className='px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-900 text-white shadow-sm'>
                {property.type}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
            <FaRegHeart className='text-gray-700 text-lg' />
          </button>

          {/* Image Indicators */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
            {[...Array(Math.min(property.images?.length || 1, 5))].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === 0 ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className='flex-1 p-6 lg:p-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between h-full'>
            {/* Left Side - Details */}
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {property.name}
              </h2>

              {/* Location */}
              <div className='flex items-center gap-2 text-gray-600 mb-4'>
                <FaMapMarkerAlt className='text-sm' />
                <span className='text-sm'>
                  {property.location.city}, {property.location.state}
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
                  {property.baths} Baths
                </span>
                <span className='text-gray-300'>•</span>
                <span className='flex items-center gap-1.5'>
                  <FaRulerCombined className='text-blue-500' />
                  {property.square_feet} sqft
                </span>
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
                  {property.rates.nightly ? (
                    `$${property.rates.nightly.toLocaleString()}`
                  ) : property.rates.weekly ? (
                    `$${property.rates.weekly.toLocaleString()}`
                  ) : property.rates.monthly ? (
                    `$${property.rates.monthly.toLocaleString()}`
                  ) : (
                    'Contact for rates'
                  )}
                </div>
                <div className='text-xs text-gray-500'>
                  {property.rates.nightly && 'Per Night'}
                  {property.rates.weekly && !property.rates.nightly && 'Per Week'}
                  {property.rates.monthly && !property.rates.nightly && !property.rates.weekly && 'Per Month'}
                </div>
              </div>

              <Link
                href={`/properties/${property._id}`}
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