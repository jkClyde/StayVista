import { FaChevronDown, FaMapMarkedAlt } from 'react-icons/fa';

const PropertyFilters = () => {
  return (
    <aside className='hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto'>
      <div className='p-6 space-y-6'>
        {/* Map View */}
        {/* <div className='border border-gray-300 rounded-lg overflow-hidden'>
          <div className='relative h-48 bg-gray-200'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <FaMapMarkedAlt className='text-6xl text-gray-400' />
            </div>
            <button className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2'>
              <FaMapMarkedAlt />
              View on Map
            </button>
          </div>
        </div> */}

        {/* Display Total Price Toggle */}
        {/* <div className='border-b border-gray-200 pb-4'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-gray-900'>Display Total Price</span>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input type='checkbox' className='sr-only peer' />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className='text-sm text-gray-500 mt-1'>Price per night with taxes</p>
        </div> */}

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
                placeholder='999'
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='text-xs text-gray-600 mb-1 block'>Max Price</label>
              <input
                type='number'
                placeholder='$ 10000'
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
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>Newly Launched</span>
              </div>
              <span className='text-xs bg-red-500 text-white px-2 py-0.5 rounded'>
                50% Off on 2nd Night
              </span>
            </label>
            <label className='flex items-center cursor-pointer group'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 ml-2'>High Speed WiFi</span>
            </label>
            <label className='flex items-center cursor-pointer group'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 ml-2'>Pure Veg</span>
            </label>
            <label className='flex items-center cursor-pointer group'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 ml-2'>Pool / Jacuzzi</span>
            </label>
            <label className='flex items-center cursor-pointer group'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 ml-2'>Pet Friendly</span>
            </label>
            <button className='text-sm text-blue-600 hover:underline'>See More</button>
          </div>
        </div>

      
      </div>
    </aside>
  );
};

export default PropertyFilters;