import connectDB from '@/config/database';
import Property from '@/models/Property';
import Pagination from '@/components/Pagination';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyList from '@/components/PropertyList';

const PropertiesPage = async ({ searchParams }) => {
  const params = await searchParams;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
  const page = params.page ? parseInt(params.page) : 1;

  await connectDB();
  const skip = (page - 1) * pageSize;

  const total = await Property.countDocuments({});
  const properties = await Property.find({}).skip(skip).limit(pageSize).lean();

  return (
    <section className='min-h-screen bg-gray-50'>
      <div className='flex'>
        {/* Sidebar Filters */}
        <PropertyFilters />

        {/* Main Content */}
        <main className='flex-1 p-4 lg:p-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Available Rooms
              </h1>
            </div>

            {/* Property List */}
            <PropertyList properties={properties} />

            {/* Pagination */}
            <div className='mt-8'>
              <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={total}
              />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default PropertiesPage;