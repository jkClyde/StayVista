import PropertyCard from '@/components/PropertyCard';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import Pagination from '@/components/Pagination';

const PropertiesPage = async ({ searchParams }) => {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 9;
  const page = params.page ? parseInt(params.page) : 1;

  await connectDB();
  const skip = (page - 1) * pageSize;

  const total = await Property.countDocuments({});
  const properties = await Property.find({}).skip(skip).limit(pageSize).lean();

  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={total}
        />
      </div>
    </section>
  );
};

export default PropertiesPage;