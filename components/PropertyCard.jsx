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
  const getRateDisplay = () => {
    const { rates } = property;
    if (rates.monthly) {
      return `$${rates.monthly.toLocaleString()}/mo`;
    } else if (rates.weekly) {
      return `$${rates.weekly.toLocaleString()}/wk`;
    } else if (rates.nightly) {
      return `$${rates.nightly.toLocaleString()}/night`;
    }
  };

  return (
    <div className='rounded-xl shadow-md relative'>
      <Image
        src={property.images[0]}
        alt=''
        height={0}
        width={0}
        sizes='100vw'
        className='w-full h-[192px] md:h-64 object-cover rounded-t-xl'
        priority={true}
      />
      <div className=''>
        {/* Property Name */}
        <div className='text-left md:text-center lg:text-left mb-6 bg-[#1A1E43] p-4'>
          <div className='text-white'>{property.type}</div>
          <h3 className='text-xl font-bold text-white'>{property.name}</h3>
        </div>

        <div className="px-4">
          <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-[#23274A] font-bold text-right md:text-center lg:text-right'>
            {getRateDisplay()}
          </h3>

          <div className='flex justify-center gap-4 text-gray-500 mb-4'>
            <p>
              <FaBed className='md:hidden lg:inline mr-2' /> {property.beds}
              <span className='md:hidden lg:inline'> Beds</span>
            </p>
            <p>
              <FaBath className='md:hidden lg:inline mr-2' /> {property.baths}
              <span className='md:hidden lg:inline'> Baths</span>
            </p>
            <p>
              <FaRulerCombined className='md:hidden lg:inline  mr-2' />{' '}
              {property.square_feet}
              <span className='md:hidden lg:inline'> sqft</span>
            </p>
          </div>

          <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
            <p>
              <FaMoneyBill className='md:hidden lg:inline mr-2' /> Weekly
            </p>
            <p>
              <FaMoneyBill className='md:hidden lg:inline mr-2' /> Monthly
            </p>
          </div>

        </div>
        <div className='border border-gray-100 mb-5'></div>

        {/* Card Footer */}
        <div className='flex flex-col lg:flex-row justify-between mb-4 px-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-orange-700 mt-1' />
            <span className='text-orange-700'>
              {' '}
              {property.location.city}, {property.location.state}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
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