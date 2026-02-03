import PropertyCard2 from './PropertyCards2';

const PropertyList = ({ properties }) => {
  if (properties.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
        <p className='text-gray-500 text-lg'>No properties found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {properties.map((property) => (
        <PropertyCard2 key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;