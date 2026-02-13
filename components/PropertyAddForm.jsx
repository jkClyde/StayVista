'use client';
import addProperty from '@/app/actions/addProperty';

const PropertyAddForm = () => {
  return (
    <form action={addProperty}>
      <h2 className='text-3xl text-center font-semibold mb-6'>Add Property</h2>

      <div className='mb-4'>
        <label htmlFor='propertyType' className='block text-gray-700 font-bold mb-2'>
          Property Type
        </label>
        <select
          id='propertyType'
          name='propertyType'
          className='border rounded w-full py-2 px-3'
          required
        >
          <option value='entire_place'>Entire Place</option>
          <option value='private_room'>Private Room</option>
          <option value='bedspace'>Bedspace</option>
        </select>
      </div>

      <div className='mb-4'>
        <label htmlFor='title' className='block text-gray-700 font-bold mb-2'>
          Property Title
        </label>
        <input
          type='text'
          id='title'
          name='title'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='eg. Cozy Studio in Baguio City'
          required
        />
      </div>

      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows='4'
          placeholder='Add an optional description of your property'
        ></textarea>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>Location</label>
        <div className='mb-2'>
          <label htmlFor='area' className='block text-gray-600 mb-1'>
            Area
          </label>
          <select
            id='area'
            name='location.area'
            className='border rounded w-full py-2 px-3'
            required
          >
            <option value=''>Select Area</option>
            <option value='Baguio City'>Baguio City</option>
            <option value='La Trinidad'>La Trinidad</option>
            <option value='Itogon'>Itogon</option>
            <option value='Sablan'>Sablan</option>
            <option value='Tuba'>Tuba</option>
            <option value='Tublay'>Tublay</option>
          </select>
        </div>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Street Address (Optional)'
        />
        <input
          type='text'
          id='landmark'
          name='location.landmark'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Landmark (Optional)'
        />
      </div>

      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/2 pr-2 mb-4'>
          <label htmlFor='maxGuests' className='block text-gray-700 font-bold mb-2'>
            Max Guests
          </label>
          <input
            type='number'
            id='maxGuests'
            name='maxGuests'
            className='border rounded w-full py-2 px-3'
            min='1'
            required
          />
        </div>
        <div className='w-full sm:w-1/2 pl-2 mb-4'>
          <label htmlFor='bedrooms' className='block text-gray-700 font-bold mb-2'>
            Bedrooms
          </label>
          <input
            type='number'
            id='bedrooms'
            name='bedrooms'
            className='border rounded w-full py-2 px-3'
            min='0'
            defaultValue='0'
          />
        </div>
        <div className='w-full sm:w-1/2 pr-2'>
          <label htmlFor='beds' className='block text-gray-700 font-bold mb-2'>
            Beds
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3'
            min='1'
            required
          />
        </div>
        <div className='w-full sm:w-1/2 pl-2'>
          <label htmlFor='bathrooms' className='block text-gray-700 font-bold mb-2'>
            Bathrooms
          </label>
          <input
            type='number'
            id='bathrooms'
            name='bathrooms'
            className='border rounded w-full py-2 px-3'
            min='1'
            step='0.5'
            required
          />
        </div>
      </div>

      <div className='mb-4'>
        <label htmlFor='basePricePerNight' className='block text-gray-700 font-bold mb-2'>
          Base Price Per Night (₱)
        </label>
        <input
          type='number'
          id='basePricePerNight'
          name='basePricePerNight'
          className='border rounded w-full py-2 px-3'
          placeholder='Enter price per night'
          min='0'
          step='0.01'
          required
        />
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Amenities</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-2'
            />
            <label htmlFor='amenity_wifi'>Wifi</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Full kitchen'
              className='mr-2'
            />
            <label htmlFor='amenity_kitchen'>Full kitchen</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Washer & Dryer'
              className='mr-2'
            />
            <label htmlFor='amenity_washer_dryer'>Washer & Dryer</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Free Parking'
              className='mr-2'
            />
            <label htmlFor='amenity_free_parking'>Free Parking</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Swimming Pool'
              className='mr-2'
            />
            <label htmlFor='amenity_pool'>Swimming Pool</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Hot Tub'
              className='mr-2'
            />
            <label htmlFor='amenity_hot_tub'>Hot Tub</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='24/7 Security'
              className='mr-2'
            />
            <label htmlFor='amenity_24_7_security'>24/7 Security</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Wheelchair Accessible'
              className='mr-2'
            />
            <label htmlFor='amenity_wheelchair_accessible'>
              Wheelchair Accessible
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              value='Elevator Access'
              className='mr-2'
            />
            <label htmlFor='amenity_elevator_access'>Elevator Access</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Dishwasher'
              className='mr-2'
            />
            <label htmlFor='amenity_dishwasher'>Dishwasher</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym/Fitness Center'
              className='mr-2'
            />
            <label htmlFor='amenity_gym_fitness_center'>
              Gym/Fitness Center
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Air Conditioning'
              className='mr-2'
            />
            <label htmlFor='amenity_air_conditioning'>Air Conditioning</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcony/Patio'
              className='mr-2'
            />
            <label htmlFor='amenity_balcony_patio'>Balcony/Patio</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2'
            />
            <label htmlFor='amenity_smart_tv'>Smart TV</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Coffee Maker'
              className='mr-2'
            />
            <label htmlFor='amenity_coffee_maker'>Coffee Maker</label>
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label htmlFor='houseRules' className='block text-gray-700 font-bold mb-2'>
          House Rules
        </label>
        <textarea
          id='houseRules'
          name='houseRules'
          className='border rounded w-full py-2 px-3'
          rows='3'
          placeholder='e.g., No smoking, No pets, Quiet hours after 10 PM'
        ></textarea>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Check-in/Check-out Times
        </label>
        <div className='flex flex-col sm:flex-row sm:space-x-4'>
          <div className='flex-1 mb-2 sm:mb-0'>
            <label htmlFor='checkInTime' className='block text-gray-600 mb-1'>
              Check-in Time
            </label>
            <input
              type='time'
              id='checkInTime'
              name='checkInTime'
              className='border rounded w-full py-2 px-3'
              defaultValue='14:00'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='checkOutTime' className='block text-gray-600 mb-1'>
              Check-out Time
            </label>
            <input
              type='time'
              id='checkOutTime'
              name='checkOutTime'
              className='border rounded w-full py-2 px-3'
              defaultValue='12:00'
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label htmlFor='images' className='block text-gray-700 font-bold mb-2'>
          Images (Select up to 4 images)
        </label>
        <input
          type='file'
          id='images'
          name='images'
          className='border rounded w-full py-2 px-3'
          accept='image/*'
          multiple
          required
        />
      </div>

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Add Property
        </button>
      </div>
    </form>
  );
};

export default PropertyAddForm;