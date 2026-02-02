'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PropertySearchForm = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  
  // Guest capacity state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    
    if (location) queryParams.append('location', location);
    if (checkIn) queryParams.append('checkIn', checkIn);
    if (checkOut) queryParams.append('checkOut', checkOut);
    if (adults) queryParams.append('adults', adults);
    if (children) queryParams.append('children', children);
    if (infants) queryParams.append('infants', infants);
    if (rooms) queryParams.append('rooms', rooms);

    const query = queryParams.toString();
    
    if (query) {
      router.push(`/properties/search-results?${query}`);
    } else {
      router.push('/properties');
    }
  };

  const totalGuests = adults + children + infants;

  const GuestCounter = ({ label, subtitle, value, setValue, min = 0, max = 20 }) => (
    <div className='flex items-center justify-between py-3 border-b border-gray-200 last:border-0'>
      <div>
        <div className='font-medium text-gray-800'>{label}</div>
        <div className='text-sm text-gray-500'>{subtitle}</div>
      </div>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => setValue(Math.max(min, value - 1))}
          disabled={value <= min}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
        >
          −
        </button>
        <span className='w-8 text-center font-medium'>{value < 10 ? `0${value}` : value}</span>
        <button
          type='button'
          onClick={() => setValue(Math.min(max, value + 1))}
          disabled={value >= max}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full'
    >
      <div className='bg-white rounded-lg shadow-lg p-4 md:p-6'>
        <div className='flex flex-col lg:flex-row gap-3 lg:gap-4'>
          {/* Location */}
          <div className='flex-1 min-w-0'>
            <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
              Preferred Location
            </label>
            <select
              id='location'
              className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value=''>Select Location</option>
              <option value='Baguio City'>Baguio City</option>
              <option value='La Trinidad'>La Trinidad</option>
            </select>
          </div>

          {/* Check In */}
          <div className='flex-1 min-w-0'>
            <label htmlFor='check-in' className='block text-sm font-medium text-gray-700 mb-1'>
              Check In
            </label>
            <input
              type='date'
              id='check-in'
              className='w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Check Out */}
          <div className='flex-1 min-w-0'>
            <label htmlFor='check-out' className='block text-sm font-medium text-gray-700 mb-1'>
              Check Out
            </label>
            <input
              type='date'
              id='check-out'
              className='w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              disabled={!checkIn}
            />
          </div>

          {/* Guests */}
          <div className='flex-1 min-w-0 relative'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Guests & Rooms
            </label>
            <button
              type='button'
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}, {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
            </button>
            
            {showGuestDropdown && (
              <>
                <div 
                  className='fixed inset-0 z-10'
                  onClick={() => setShowGuestDropdown(false)}
                />
                <div className='absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20 w-full min-w-[280px]'>
                  <GuestCounter
                    label='Adults'
                    subtitle='Age 13 years and more'
                    value={adults}
                    setValue={setAdults}
                    min={1}
                  />
                  <GuestCounter
                    label='Children'
                    subtitle='Age 3-12 years'
                    value={children}
                    setValue={setChildren}
                  />
                  <GuestCounter
                    label='Infants'
                    subtitle='Age 0-2 years'
                    value={infants}
                    setValue={setInfants}
                  />
                  <GuestCounter
                    label='Rooms'
                    subtitle=''
                    value={rooms}
                    setValue={setRooms}
                    min={1}
                  />
                  <button
                    type='button'
                    onClick={() => setShowGuestDropdown(false)}
                    className='mt-3 w-full px-4 py-2 bg-[#23274A] text-white rounded-lg hover:bg-[#313666] transition-colors'
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Search Button */}
          <div className='flex items-end'>
            <button
              type='submit'
              className='w-full lg:w-auto px-8 py-3 rounded-lg bg-[#23274A] text-white hover:bg-[#313666] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium whitespace-nowrap'
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PropertySearchForm;