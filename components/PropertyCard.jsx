import Image from 'next/image';
import Link from 'next/link';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  // Handle both old and new schema
  const propertyName = property.title || property.name;
  const propertyType = property.propertyType || property.type;
  const bathrooms = property.bathrooms || property.baths;
  const locationCity = property.location?.area || property.location?.city;
  const locationState = property.location?.state;
  
  // NIGHTLY ONLY
  const pricePerNight = property.basePricePerNight || property.rates?.nightly;

  const getRateDisplay = () => {
    if (pricePerNight) {
      return `₱${pricePerNight.toLocaleString()}/night`;
    }
    return 'Contact for rates';
  };

  // Format property type safely
  const formatPropertyType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className='rounded-xl shadow-md relative'>
      {property.images && property.images.length > 0 ? (
        <Image
          src={property.images[0]}
          alt={propertyName}
          height={0}
          width={0}
          sizes='100vw'
          className='w-full h-[192px] md:h-64 object-cover rounded-t-xl'
          priority={true}
        />
      ) : (
        <div className='w-full h-[192px] md:h-64 bg-gray-200 rounded-t-xl flex items-center justify-center'>
          <FaBed className='text-6xl text-gray-400' />
        </div>
      )}

      <div>
        {/* Property Name */}
        <div className='text-left md:text-center lg:text-left mb-6 bg-[#1A1E43] p-4'>
          <div className='text-white'>{formatPropertyType(propertyType)}</div>
          <h3 className='text-xl font-bold text-white'>{propertyName}</h3>
        </div>

        <div className="px-4">
          <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-[#23274A] font-bold text-right md:text-center lg:text-right'>
            {getRateDisplay()}
          </h3>

          <div className='flex justify-center gap-4 text-gray-500 mb-4'>
            {property.beds && (
              <p>
                <FaBed className='md:hidden lg:inline mr-2' /> {property.beds}
                <span className='md:hidden lg:inline'> Beds</span>
              </p>
            )}
            {bathrooms && (
              <p>
                <FaBath className='md:hidden lg:inline mr-2' /> {bathrooms}
                <span className='md:hidden lg:inline'> Baths</span>
              </p>
            )}
            {property.square_feet && (
              <p>
                <FaRulerCombined className='md:hidden lg:inline mr-2' />
                {property.square_feet}
                <span className='md:hidden lg:inline'> sqft</span>
              </p>
            )}
            {property.maxGuests && (
              <p>
                👥 {property.maxGuests}
                <span className='md:hidden lg:inline'> Guests</span>
              </p>
            )}
          </div>

          {/* Nightly Label Only */}
          {pricePerNight && (
            <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
              <p>
                <FaMoneyBill className='md:hidden lg:inline mr-2' /> Nightly
              </p>
            </div>
          )}
        </div>

        <div className='border border-gray-100 mb-5'></div>

        {/* Card Footer */}
        <div className='flex flex-col lg:flex-row justify-between mb-4 px-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-orange-700 mt-1' />
            <span className='text-orange-700'>
              {locationCity}
              {locationState && `, ${locationState}`}
              {property.location?.landmark && ` - Near ${property.location.landmark}`}
            </span>
          </div>

          <Link
            href={`/listings/${property._id}`}
            className='h-[36px] bg-[#23274A] hover:bg-[#32356B] text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
