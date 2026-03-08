import PropertyCard2 from './PropertyCards2';

const PropertyList = ({ properties, checkIn = '', checkOut = '' }) => {
  if (properties.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
        <p className='text-gray-500 text-lg'>No properties found</p>
        {checkIn && checkOut && (
          <p className='text-gray-400 text-sm mt-2'>
            Try different dates or adjust your filters
          </p>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {properties.map((property) => (
        <PropertyCard2
          key={property._id}
          property={property}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      ))}
    </div>
  );
};

export default PropertyList;