import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker,
} from 'react-icons/fa';
import PropertyMap from '@/components/PropertyMap';

const PropertyDetails = ({ property }) => {
  // Safety check - if property is undefined or null
  if (!property) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md'>
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
    <main>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        {propertyType && (
          <div className='text-gray-500 mb-4'>
            {formatPropertyType(propertyType)}
          </div>
        )}
        <h1 className='text-3xl font-bold mb-4'>{propertyName}</h1>
        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
          <FaMapMarker className='text-orange-700 mt-1 mr-1' />
          <p className='text-orange-700'>
            {locationStreet && `${locationStreet}, `}
            {locationCity}
            {locationState && ` ${locationState}`}
            {property.location?.landmark && ` - Near ${property.location.landmark}`}
          </p>
        </div>

        <h3 className='text-lg font-bold my-6 bg-gray-800 text-white p-2'>
          Rates & Options
        </h3>
        <div className='flex flex-col md:flex-row justify-around'>
          <div className='flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0'>
            <div className='text-gray-500 mr-2 font-bold'>Nightly</div>
            <div className='text-2xl font-bold text-[#1A1E43]'>
              {pricePerNight ? (
                `₱${pricePerNight.toLocaleString()}`
              ) : (
                <FaTimes className='text-red-700' />
              )}
            </div>
          </div>
          {pricePerWeek && (
            <div className='flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0'>
              <div className='text-gray-500 mr-2 font-bold'>Weekly</div>
              <div className='text-2xl font-bold text-[#1A1E43]'>
                ₱{pricePerWeek.toLocaleString()}
              </div>
            </div>
          )}
          {pricePerMonth && (
            <div className='flex items-center justify-center mb-4 pb-4 md:pb-0'>
              <div className='text-gray-500 mr-2 font-bold'>Monthly</div>
              <div className='text-2xl font-bold text-[#1A1E43]'>
                ₱{pricePerMonth.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6'>Description & Details</h3>
        <div className='flex justify-center gap-4 text-[#1A1E43] mb-4 text-xl space-x-9'>
          {property.beds && (
            <p>
              <FaBed className='inline-block mr-2' /> {property.beds}{' '}
              <span className='hidden sm:inline'>Beds</span>
            </p>
          )}
          {bathrooms && (
            <p>
              <FaBath className='inline-block mr-2' /> {bathrooms}{' '}
              <span className='hidden sm:inline'>Baths</span>
            </p>
          )}
          {property.bedrooms > 0 && (
            <p>
              <i className='fa-solid fa-bed-front inline-block mr-2'></i>{' '}
              {property.bedrooms}{' '}
              <span className='hidden sm:inline'>Bedrooms</span>
            </p>
          )}
          {property.square_feet && (
            <p>
              <FaRulerCombined className='inline-block mr-2' />
              {property.square_feet}{' '}
              <span className='hidden sm:inline'>sqft</span>
            </p>
          )}
        </div>
        {property.maxGuests && (
          <p className='text-gray-500 mb-4'>Max Guests: {property.maxGuests}</p>
        )}
        {property.description && (
          <p className='text-gray-500 mb-4'>{property.description}</p>
        )}
      </div>

      {property.amenities && property.amenities.length > 0 && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-6'>Amenities</h3>
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2'>
            {property.amenities.map((amenity, index) => (
              <li key={index}>
                <FaCheck className='inline-block text-green-600 mr-2' /> {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {property.houseRules && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-6'>House Rules</h3>
          <p className='text-gray-700 whitespace-pre-wrap'>
            {property.houseRules}
          </p>
        </div>
      )}

      {(property.checkInTime || property.checkOutTime) && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-6'>Check-in/Check-out</h3>
          <div className='flex flex-col sm:flex-row justify-around'>
            {property.checkInTime && (
              <div className='mb-4 sm:mb-0'>
                <p className='text-gray-500 font-bold'>Check-in Time</p>
                <p className='text-2xl font-bold text-[#1A1E43]'>
                  {property.checkInTime}
                </p>
              </div>
            )}
            {property.checkOutTime && (
              <div>
                <p className='text-gray-500 font-bold'>Check-out Time</p>
                <p className='text-2xl font-bold text-[#1A1E43]'>
                  {property.checkOutTime}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {property.seller_info && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-6'>Contact Information</h3>
          <p className='text-gray-700'>
            <strong>Name:</strong> {property.seller_info.name}
          </p>
          <p className='text-gray-700'>
            <strong>Email:</strong> {property.seller_info.email}
          </p>
          {property.seller_info.phone && (
            <p className='text-gray-700'>
              <strong>Phone:</strong> {property.seller_info.phone}
            </p>
          )}
        </div>
      )}

      {/* <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <PropertyMap property={property} />
      </div> */}
    </main>
  );
};

export default PropertyDetails;