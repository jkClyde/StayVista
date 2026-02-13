import Link from 'next/link';
import Image from 'next/image';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from 'react-icons/fa';

const FeaturedPropertyCard = ({ property }) => {
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
    <div className='bg-white rounded-xl shadow-md relative flex flex-col md:flex-row'>
      {property.images && property.images.length > 0 ? (
        <Image
          src={property.images[0]}
          alt={propertyName}
          width={0}
          height={0}
          sizes='100vw'
          className='object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5'
        />
      ) : (
        <div className='bg-gray-200 rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5 flex items-center justify-center'>
          <FaBed className='text-6xl text-gray-400' />
        </div>
      )}

      <div className='p-6'>
        <h3 className='text-xl font-bold'>{propertyName}</h3>
        <div className='text-gray-600 mb-4'>{formatPropertyType(propertyType)}</div>

        <h3 className='absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right'>
          {getRateDisplay()}
        </h3>

        <div className='flex justify-center gap-4 text-gray-500 mb-4'>
          {property.beds && (
            <p>
              <FaBed className='inline-block mr-2' /> {property.beds}{' '}
              <span className='md:hidden lg:inline'>Beds</span>
            </p>
          )}
          {bathrooms && (
            <p>
              <FaBath className='inline-block mr-2' /> {bathrooms}{' '}
              <span className='md:hidden lg:inline'>Baths</span>
            </p>
          )}
          {property.square_feet && (
            <p>
              <FaRulerCombined className='inline-block mr-2' />
              {property.square_feet}{' '}
              <span className='md:hidden lg:inline'>sqft</span>
            </p>
          )}
          {property.maxGuests && (
            <p>
              👥 {property.maxGuests}{' '}
              <span className='md:hidden lg:inline'>Guests</span>
            </p>
          )}
        </div>

        {/* Nightly Label Only */}
        {pricePerNight && (
          <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
            <p>
              <FaMoneyBill className='inline mr-2' /> Nightly
            </p>
          </div>
        )}

        <div className='border border-gray-200 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-lg text-orange-700' />
            <span className='text-orange-700'>
              {locationCity}
              {locationState && ` ${locationState}`}
              {property.location?.landmark && ` - Near ${property.location.landmark}`}
            </span>
          </div>

          <Link
            href={`/properties/${property._id}`}
            className='h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPropertyCard;
