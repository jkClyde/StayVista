import Image from 'next/image';
import Link from 'next/link';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaRegHeart,
  FaChevronDown,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import Pagination from '@/components/Pagination';

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
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <aside className='hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto'>
          <div className='p-6 space-y-6'>
            {/* Map View */}
            <div className='border border-gray-300 rounded-lg overflow-hidden'>
              <div className='relative h-48 bg-gray-200'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <FaMapMarkedAlt className='text-6xl text-gray-400' />
                </div>
                <button className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2'>
                  <FaMapMarkedAlt />
                  View on Map
                </button>
              </div>
            </div>

            {/* Display Total Price Toggle */}
            <div className='border-b border-gray-200 pb-4'>
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-gray-900'>Display Total Price</span>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className='text-sm text-gray-500 mt-1'>Price per night with taxes</p>
            </div>

            {/* Price Range */}
            <div className='border-b border-gray-200 pb-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>Price Range</h3>
              <div className='mb-4'>
                <div className='h-1 bg-gray-200 rounded-full'>
                  <div className='h-1 bg-blue-600 rounded-full' style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-xs text-gray-600 mb-1 block'>Min Price</label>
                  <input
                    type='number'
                    placeholder='$ 1000'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='text-xs text-gray-600 mb-1 block'>Max Price</label>
                  <input
                    type='number'
                    placeholder='$ 500000'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
              <button className='w-full mt-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors'>
                Apply
              </button>
            </div>

            {/* Rooms */}
            <div className='border-b border-gray-200 pb-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>Rooms</h3>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-700'>No. of Rooms</span>
                <div className='flex items-center gap-3'>
                  <button className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center'>
                    -
                  </button>
                  <span className='text-sm font-medium w-8 text-center'>01+</span>
                  <button className='w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center'>
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Key Amenities/Features */}
            <div className='border-b border-gray-200 pb-6'>
              <button className='flex items-center justify-between w-full mb-4'>
                <h3 className='font-semibold text-gray-900'>Key Amenities/ Features</h3>
                <FaChevronDown className='text-gray-600' />
              </button>
              <div className='space-y-3'>
                <label className='flex items-center justify-between cursor-pointer group'>
                  <div className='flex items-center gap-2'>
                    <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                    <span className='text-sm text-gray-700'>Newly Launched</span>
                  </div>
                  <span className='text-xs bg-red-500 text-white px-2 py-0.5 rounded'>50% Off on 2nd Night</span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                  <span className='text-sm text-gray-700 ml-2'>High Speed WiFi</span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                  <span className='text-sm text-gray-700 ml-2'>Pure Veg</span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                  <span className='text-sm text-gray-700 ml-2'>Pool / Jacuzzi</span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                  <span className='text-sm text-gray-700 ml-2'>Pet Friendly</span>
                </label>
                <button className='text-sm text-blue-600 hover:underline'>See More</button>
              </div>
            </div>

            {/* Brands */}
            <div>
              <button className='flex items-center justify-between w-full'>
                <h3 className='font-semibold text-gray-900'>Brands</h3>
                <FaChevronDown className='text-gray-600' />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-4 lg:p-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Available Properties
              </h1>
              <p className='text-gray-600'>
                Discover {total} exceptional properties
              </p>
            </div>

            {properties.length === 0 ? (
              <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                <p className='text-gray-500 text-lg'>No properties found</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden'
                  >
                    <div className='flex flex-col lg:flex-row'>
                      {/* Property Image */}
                      <div className='relative lg:w-80 h-64 lg:h-auto flex-shrink-0'>
                        {property.images && property.images.length > 0 ? (
                          <Image
                            src={property.images[0]}
                            alt={property.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400'>
                            <FaBed className='text-6xl' />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className='absolute top-4 left-4 flex gap-2'>
                          {property.type && (
                            <span className='px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-900 text-white shadow-sm'>
                              {property.type}
                            </span>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
                          <FaRegHeart className='text-gray-700 text-lg' />
                        </button>

                        {/* Image Indicators */}
                        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i === 0 ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className='flex-1 p-6 lg:p-8'>
                        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between h-full'>
                          {/* Left Side - Details */}
                          <div className='flex-1'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                              {property.name}
                            </h2>

                            {/* Location */}
                            <div className='flex items-center gap-2 text-gray-600 mb-4'>
                              <FaMapMarkerAlt className='text-sm' />
                              <span className='text-sm'>{property.location.city}, {property.location.state}</span>
                            </div>

                            {/* Room Details */}
                            <div className='flex flex-wrap gap-4 mb-4 text-sm text-gray-700'>
                              <span className='flex items-center gap-1.5'>
                                <FaBed className='text-blue-500' />
                                {property.beds} Beds
                              </span>
                              <span className='text-gray-300'>•</span>
                              <span className='flex items-center gap-1.5'>
                                <FaBath className='text-blue-500' />
                                {property.baths} Baths
                              </span>
                              <span className='text-gray-300'>•</span>
                              <span className='flex items-center gap-1.5'>
                                <FaRulerCombined className='text-blue-500' />
                                {property.square_feet} sqft
                              </span>
                            </div>

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                              <div className='flex flex-wrap gap-3 mb-4'>
                                {property.amenities.slice(0, 5).map((amenity, index) => (
                                  <span
                                    key={index}
                                    className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'
                                  >
                                    {amenity}
                                  </span>
                                ))}
                                {property.amenities.length > 5 && (
                                  <span className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'>
                                    +{property.amenities.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Description */}
                            {property.description && (
                              <p className='text-sm text-gray-600 line-clamp-2'>
                                {property.description}
                              </p>
                            )}
                          </div>

                          {/* Right Side - Price & Action */}
                          <div className='lg:ml-8 mt-6 lg:mt-0 flex flex-col items-end'>
                            <div className='text-right mb-4'>
                              <div className='text-3xl font-bold text-gray-900 mb-1'>
                                {property.rates.nightly ? (
                                  `$${property.rates.nightly.toLocaleString()}`
                                ) : property.rates.weekly ? (
                                  `$${property.rates.weekly.toLocaleString()}`
                                ) : property.rates.monthly ? (
                                  `$${property.rates.monthly.toLocaleString()}`
                                ) : (
                                  'Contact for rates'
                                )}
                              </div>
                              <div className='text-xs text-gray-500'>
                                {property.rates.nightly && 'Per Night'}
                                {property.rates.weekly && !property.rates.nightly && 'Per Week'}
                                {property.rates.monthly && !property.rates.nightly && !property.rates.weekly && 'Per Month'}
                              </div>
                            </div>

                            <Link
                              href={`/properties/${property._id}`}
                              className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
                            >
                              View Details
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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