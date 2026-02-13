import Link from 'next/link';

const Pagination = ({ page, pageSize, totalItems, filters = {} }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Build query string from filters
  const buildQueryString = (pageNum) => {
    const params = new URLSearchParams();
    params.set('page', pageNum);
    
    if (pageSize && pageSize !== 10) {
      params.set('pageSize', pageSize);
    }

    // Add filter params
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms > 0) params.set('bedrooms', filters.bedrooms);
    if (filters.amenities?.length > 0) {
      params.set('amenities', filters.amenities.join(','));
    }
    if (filters.propertyType?.length > 0) {
      params.set('propertyType', filters.propertyType.join(','));
    }
    if (filters.location?.length > 0) {
      params.set('location', filters.location.join(','));
    }

    return params.toString();
  };

  return (
    <section className='container mx-auto flex justify-center items-center my-8'>
      {page > 1 ? (
        <Link
          className='mr-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
          href={`/properties?${buildQueryString(page - 1)}`}
        >
          Previous
        </Link>
      ) : null}

      <span className='mx-4 text-gray-700'>
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          className='ml-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
          href={`/properties?${buildQueryString(page + 1)}`}
        >
          Next
        </Link>
      ) : null}
    </section>
  );
};

export default Pagination;