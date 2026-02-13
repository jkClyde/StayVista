'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyList from '@/components/PropertyList';
import Pagination from '@/components/Pagination';

const PropertiesClient = ({ initialProperties, initialFilters, page, pageSize, total }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filters) => {
    // Build query string from filters
    const params = new URLSearchParams(searchParams);
    
    // Reset to page 1 when filters change
    params.set('page', '1');

    // Price
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    } else {
      params.delete('minPrice');
    }

    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    } else {
      params.delete('maxPrice');
    }

    // Bedrooms
    if (filters.bedrooms > 0) {
      params.set('bedrooms', filters.bedrooms);
    } else {
      params.delete('bedrooms');
    }

    // Amenities
    if (filters.amenities.length > 0) {
      params.set('amenities', filters.amenities.join(','));
    } else {
      params.delete('amenities');
    }

    // Property Type
    if (filters.propertyType.length > 0) {
      params.set('propertyType', filters.propertyType.join(','));
    } else {
      params.delete('propertyType');
    }

    // Location
    if (filters.location.length > 0) {
      params.set('location', filters.location.join(','));
    } else {
      params.delete('location');
    }

    // Navigate with new filters
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className='min-h-screen bg-gray-50'>
      <div className='flex'>
        {/* Sidebar Filters */}
        <PropertyFilters 
          onFilterChange={handleFilterChange}
          initialFilters={initialFilters}
        />

        {/* Main Content */}
        <main className='flex-1 p-4 lg:p-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Available Rooms
                <span className='text-lg font-normal text-gray-600 ml-3'>
                  ({total} {total === 1 ? 'property' : 'properties'})
                </span>
              </h1>
            </div>

            {/* Empty State */}
            {initialProperties.length === 0 ? (
              <div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>No properties found</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <>
                {/* Property List */}
                <PropertyList properties={initialProperties} />

                {/* Pagination */}
                <div className='mt-8'>
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={total}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default PropertiesClient;