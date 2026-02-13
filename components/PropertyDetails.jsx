import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker,
  FaClock,
  FaUsers,
} from 'react-icons/fa';
import PropertyMap from '@/components/PropertyMap';

const PropertyDetails = ({ property }) => {
  // Safety check - if property is undefined or null
  if (!property) {
    return (
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
        <p className='text-gray-500 text-center'>Property details not available</p>
      </div>
    );
  }

  // Handle both old schema (rates.nightly) and new schema (basePricePerNight)
  const pricePerNight = property.basePricePerNight || property.rates?.nightly;
  const pricePerWeek = property.rates?.weekly;
  const pricePerMonth = property.rates?.monthly;
  
  // Handle field name differences
  const propertyName = property.title || property.name;
  const propertyType = property.propertyType || property.type;
  const bathrooms = property.bathrooms || property.baths;
  const locationCity = property.location?.area || property.location?.city;
  const locationState = property.location?.state;
  const locationStreet = property.location?.street;

  // Format property type safely
  const formatPropertyType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <main className='space-y-6'>
      {/* Header Card */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='p-6 sm:p-8'>
          {/* Property Type Badge */}
          {propertyType && (
            <span className='inline-block px-4 py-1.5 bg-[#1A1E43] text-white text-sm font-semibold rounded-full mb-4'>
              {formatPropertyType(propertyType)}
            </span>
          )}
          
          {/* Title */}
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
            {propertyName}
          </h1>
          
          {/* Location */}
          <div className='flex items-start gap-2 text-gray-600 mb-6'>
            <FaMapMarker className='text-orange-500 mt-1 flex-shrink-0' />
            <p className='text-lg'>
              {locationStreet && <span className='font-medium'>{locationStreet}, </span>}
              {locationCity}
              {locationState && <span>, {locationState}</span>}
              {property.location?.landmark && (
                <span className='block text-sm text-gray-500 mt-1'>
                  Near {property.location.landmark}
                </span>
              )}
            </p>
          </div>

          {/* Price Section */}
          <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
            <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>
              Pricing
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='text-center sm:text-left'>
                <p className='text-sm text-gray-600 mb-1'>Per Night</p>
                <p className='text-3xl font-bold text-[#1A1E43]'>
                  {pricePerNight ? (
                    `₱${pricePerNight.toLocaleString()}`
                  ) : (
                    <FaTimes className='text-red-500 text-xl inline' />
                  )}
                </p>
              </div>
              
              {pricePerWeek && (
                <div className='text-center sm:text-left'>
                  <p className='text-sm text-gray-600 mb-1'>Per Week</p>
                  <p className='text-2xl font-bold text-[#1A1E43]'>
                    ₱{pricePerWeek.toLocaleString()}
                  </p>
                </div>
              )}
              
              {pricePerMonth && (
                <div className='text-center sm:text-left'>
                  <p className='text-sm text-gray-600 mb-1'>Per Month</p>
                  <p className='text-2xl font-bold text-[#1A1E43]'>
                    ₱{pricePerMonth.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Property Details</h3>
        
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          {property.beds && (
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <FaBed className='text-3xl text-[#1A1E43] mx-auto mb-2' />
              <p className='text-2xl font-bold text-gray-900'>{property.beds}</p>
              <p className='text-sm text-gray-600'>Beds</p>
            </div>
          )}
          
          {bathrooms && (
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <FaBath className='text-3xl text-[#1A1E43] mx-auto mb-2' />
              <p className='text-2xl font-bold text-gray-900'>{bathrooms}</p>
              <p className='text-sm text-gray-600'>Baths</p>
            </div>
          )}
          
          {property.bedrooms > 0 && (
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <i className='fa-solid fa-bed-front text-3xl text-[#1A1E43] mb-2' />
              <p className='text-2xl font-bold text-gray-900'>{property.bedrooms}</p>
              <p className='text-sm text-gray-600'>Bedrooms</p>
            </div>
          )}
          
          {property.square_feet && (
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <FaRulerCombined className='text-3xl text-[#1A1E43] mx-auto mb-2' />
              <p className='text-2xl font-bold text-gray-900'>{property.square_feet}</p>
              <p className='text-sm text-gray-600'>sqft</p>
            </div>
          )}
          
          {property.maxGuests && (
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <FaUsers className='text-3xl text-[#1A1E43] mx-auto mb-2' />
              <p className='text-2xl font-bold text-gray-900'>{property.maxGuests}</p>
              <p className='text-sm text-gray-600'>Guests</p>
            </div>
          )}
        </div>

        {property.description && (
          <div className='mt-8 pt-8 border-t border-gray-200'>
            <h4 className='font-semibold text-gray-900 mb-3'>Description</h4>
            <p className='text-gray-700 leading-relaxed'>{property.description}</p>
          </div>
        )}
      </div>

      {/* Amenities Card */}
      {property.amenities && property.amenities.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>Amenities</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {property.amenities.map((amenity, index) => (
              <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <FaCheck className='text-green-600 flex-shrink-0' />
                <span className='text-gray-700'>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* House Rules Card */}
      {property.houseRules && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>House Rules</h3>
          <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
            {property.houseRules}
          </p>
        </div>
      )}

      {/* Check-in/Check-out Card */}
      {(property.checkInTime || property.checkOutTime) && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>Check-in & Check-out</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {property.checkInTime && (
              <div className='flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <FaClock className='text-green-600 text-xl' />
                </div>
                <div>
                  <p className='text-sm text-gray-600 font-medium'>Check-in</p>
                  <p className='text-2xl font-bold text-gray-900'>{property.checkInTime}</p>
                </div>
              </div>
            )}
            {property.checkOutTime && (
              <div className='flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100'>
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <FaClock className='text-orange-600 text-xl' />
                </div>
                <div>
                  <p className='text-sm text-gray-600 font-medium'>Check-out</p>
                  <p className='text-2xl font-bold text-gray-900'>{property.checkOutTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Information Card */}
      {property.seller_info && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>Contact Information</h3>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <span className='text-gray-600 font-medium min-w-[80px]'>Name:</span>
              <span className='text-gray-900'>{property.seller_info.name}</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-600 font-medium min-w-[80px]'>Email:</span>
              <a href={`mailto:${property.seller_info.email}`} className='text-blue-600 hover:underline'>
                {property.seller_info.email}
              </a>
            </div>
            {property.seller_info.phone && (
              <div className='flex items-center gap-3'>
                <span className='text-gray-600 font-medium min-w-[80px]'>Phone:</span>
                <a href={`tel:${property.seller_info.phone}`} className='text-blue-600 hover:underline'>
                  {property.seller_info.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Section */}
      {/* <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <PropertyMap property={property} />
      </div> */}
    </main>
  );
};

export default PropertyDetails;