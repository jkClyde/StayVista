import connectDB from '@/config/database';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import Pagination from '@/components/Pagination';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyList from '@/components/PropertyList';

const PropertiesPage = async ({ searchParams }) => {
  const params = await searchParams;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
  const page = params.page ? parseInt(params.page) : 1;

  const checkIn  = params.checkIn  || '';
  const checkOut = params.checkOut || '';

  // Parse filters from URL
  const filters = {
    minPrice:     params.minPrice     ? Number(params.minPrice)  : '',
    maxPrice:     params.maxPrice     ? Number(params.maxPrice)  : '',
    bedrooms:     params.bedrooms     ? Number(params.bedrooms)  : 0,
    amenities:    params.amenities    ? params.amenities.split(',')    : [],
    propertyType: params.propertyType ? params.propertyType.split(',') : [],
    location:     params.location
      ? (typeof params.location === 'string' ? params.location.split(',') : [])
      : [],
    adults:   params.adults   ? Number(params.adults)   : 1,
    children: params.children ? Number(params.children) : 0,
    infants:  params.infants  ? Number(params.infants)  : 0,
  };

  await connectDB();

  // ── 1. Build MongoDB query from filters ──────────────────────────────────
  const query = {};

  if (filters.minPrice || filters.maxPrice) {
    query.basePricePerNight = {};
    if (filters.minPrice) query.basePricePerNight.$gte = filters.minPrice;
    if (filters.maxPrice) query.basePricePerNight.$lte = filters.maxPrice;
  }

  if (filters.bedrooms > 0) {
    query.bedrooms = { $gte: filters.bedrooms };
  }

  if (filters.propertyType.length > 0) {
    query.propertyType = { $in: filters.propertyType };
  }

  if (filters.location.length > 0) {
    query['location.area'] = { $in: filters.location };
  }

  if (filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities };
  }

  const totalGuests = filters.adults + filters.children + filters.infants;
  if (totalGuests > 0) {
    query.maxGuests = { $gte: totalGuests };
  }

  // ── 2. Exclude properties booked for the selected date range ─────────────
  //    A property is unavailable if ANY active booking overlaps:
  //    existing.check_in < requested checkOut  AND
  //    existing.check_out > requested checkIn
  let bookedPropertyIds = [];

  if (checkIn && checkOut) {
    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < checkOutDate) {
      const bookedBookings = await Booking.find({
        status: { $nin: ['cancelled'] },
        check_in:  { $lt: checkOutDate },
        check_out: { $gt: checkInDate },
      }).select('property');

      bookedPropertyIds = bookedBookings.map((b) => b.property);

      if (bookedPropertyIds.length > 0) {
        query._id = { $nin: bookedPropertyIds };
      }
    }
  }

  // ── 3. Paginate ──────────────────────────────────────────────────────────
  const skip  = (page - 1) * pageSize;
  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .skip(skip)
    .limit(pageSize)
    .lean();

  // ── 4. Serialize for client ──────────────────────────────────────────────
  const serializedProperties = properties.map((property) => ({
    ...property,
    _id:       property._id.toString(),
    owner:     property.owner.toString(),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  }));

  const hasDateSearch = Boolean(checkIn && checkOut);

  return (
    <section className='min-h-screen bg-gray-50'>
      <div className='flex'>
        {/* Sidebar Filters */}
        <PropertyFilters initialFilters={filters} />

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

              {/* Active search chips */}
              {(checkIn || checkOut || totalGuests > 1) && (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {checkIn && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                      Check-in: {new Date(checkIn).toLocaleDateString()}
                    </span>
                  )}
                  {checkOut && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                      Check-out: {new Date(checkOut).toLocaleDateString()}
                    </span>
                  )}
                  {totalGuests > 0 && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                      {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  )}
                  {/* Let the user know we filtered by dates */}
                  {hasDateSearch && bookedPropertyIds.length > 0 && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'>
                      ✓ Showing only available properties
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Property List */}
            <PropertyList
              properties={serializedProperties}
              checkIn={checkIn}
              checkOut={checkOut}
            />

            {/* Pagination */}
            {total > 0 && (
              <div className='mt-8'>
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={total}
                  filters={filters}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default PropertiesPage;