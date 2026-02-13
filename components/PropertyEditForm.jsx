'use client';
import { useState } from 'react';
import Image from 'next/image';
import updateProperty from '@/app/actions/updateProperty';
import { FaTimes, FaGripVertical } from 'react-icons/fa';

const PropertyEditForm = ({ property }) => {
  const updatePropertyById = updateProperty.bind(null, property._id);

  // Handle both old and new schema for default values
  const propertyType = property.propertyType || property.type;
  const propertyTitle = property.title || property.name;
  const bathrooms = property.bathrooms || property.baths;
  const locationArea = property.location?.area || property.location?.city;
  const basePricePerNight = property.basePricePerNight || property.rates?.nightly;

  // State for managing images
  const [existingImages, setExistingImages] = useState(property.images || []);
  const [newImages, setNewImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Remove existing image
  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Remove new image
  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Handle new image uploads
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  // Drag and drop handlers for existing images
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.target.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newArray = [...existingImages];
    const draggedItem = newArray[draggedIndex];
    
    // Remove from old position
    newArray.splice(draggedIndex, 1);
    
    // Insert at new position
    newArray.splice(dropIndex, 0, draggedItem);
    
    setExistingImages(newArray);
    setDraggedIndex(null);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      e.currentTarget.style.borderColor = '#3b82f6';
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = '#d1d5db';
  };

  return (
    <form action={updatePropertyById}>
      <h2 className='text-3xl text-center font-semibold mb-6'>Edit Property</h2>

      <div className='mb-4'>
        <label htmlFor='propertyType' className='block text-gray-700 font-bold mb-2'>
          Property Type
        </label>
        <select
          id='propertyType'
          name='propertyType'
          className='border rounded w-full py-2 px-3'
          required
          defaultValue={propertyType}
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
          defaultValue={propertyTitle}
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
          defaultValue={property.description}
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
            defaultValue={locationArea}
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
          defaultValue={property.location?.street}
        />
        <input
          type='text'
          id='landmark'
          name='location.landmark'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Landmark (Optional)'
          defaultValue={property.location?.landmark}
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
            defaultValue={property.maxGuests || 1}
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
            defaultValue={property.bedrooms || 0}
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
            defaultValue={property.beds}
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
            defaultValue={bathrooms}
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
          defaultValue={basePricePerNight}
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
              defaultChecked={property.amenities?.includes('Wifi')}
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
              defaultChecked={property.amenities?.includes('Full kitchen')}
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
              defaultChecked={property.amenities?.includes('Washer & Dryer')}
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
              defaultChecked={property.amenities?.includes('Free Parking')}
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
              defaultChecked={property.amenities?.includes('Swimming Pool')}
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
              defaultChecked={property.amenities?.includes('Hot Tub')}
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
              defaultChecked={property.amenities?.includes('24/7 Security')}
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
              defaultChecked={property.amenities?.includes('Wheelchair Accessible')}
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
              defaultChecked={property.amenities?.includes('Elevator Access')}
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
              defaultChecked={property.amenities?.includes('Dishwasher')}
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
              defaultChecked={property.amenities?.includes('Gym/Fitness Center')}
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
              defaultChecked={property.amenities?.includes('Air Conditioning')}
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
              defaultChecked={property.amenities?.includes('Balcony/Patio')}
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
              defaultChecked={property.amenities?.includes('Smart TV')}
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
              defaultChecked={property.amenities?.includes('Coffee Maker')}
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
          defaultValue={property.houseRules}
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
              defaultValue={property.checkInTime || '14:00'}
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
              defaultValue={property.checkOutTime || '12:00'}
            />
          </div>
        </div>
      </div>

      {/* Image Management Section with Drag & Drop */}
      <div className='mb-4 bg-gray-50 p-4 rounded-lg'>
        <label className='block text-gray-700 font-bold mb-4'>
          Property Images
        </label>

        {/* Existing Images - Draggable */}
        {existingImages.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-gray-700 font-semibold mb-3'>
              Current Images (Drag to reorder)
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {existingImages.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  className='relative group cursor-move transition-all'
                >
                  <div className='relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300 transition-all'>
                    <Image
                      src={image}
                      alt={`Property ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                    
                    {/* Drag Handle Overlay */}
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center'>
                      <FaGripVertical className='text-white opacity-0 group-hover:opacity-100 text-2xl' />
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type='button'
                    onClick={() => handleRemoveExistingImage(index)}
                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors z-10'
                    title='Remove image'
                  >
                    <FaTimes size={12} />
                  </button>

                  {/* Image Number Badge */}
                  <div className='absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-semibold'>
                    {index + 1}
                  </div>

                  {/* Main Image Badge */}
                  {index === 0 && (
                    <div className='absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold'>
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className='text-sm text-gray-600 mt-3'>
              💡 Tip: Drag and drop images to reorder. The first image will be the main thumbnail.
            </p>
          </div>
        )}

        {/* New Images Preview */}
        {newImages.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-gray-700 font-semibold mb-3'>New Images to Upload</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {newImages.map((file, index) => (
                <div key={index} className='relative group'>
                  <div className='relative w-full h-32 rounded-lg overflow-hidden border-2 border-green-500'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type='button'
                    onClick={() => handleRemoveNewImage(index)}
                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors'
                    title='Remove image'
                  >
                    <FaTimes size={12} />
                  </button>

                  {/* New Badge */}
                  <div className='absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold'>
                    NEW
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div>
          <label htmlFor='images' className='block text-gray-700 font-semibold mb-2'>
            Add More Images
          </label>
          <input
            type='file'
            id='images'
            onChange={handleNewImageChange}
            className='border rounded w-full py-2 px-3'
            accept='image/*'
            multiple
          />
          <p className='text-sm text-gray-600 mt-2'>
            Total images: {existingImages.length + newImages.length}
          </p>
        </div>

        {/* Hidden inputs to pass existing images in order */}
        {existingImages.map((image, index) => (
          <input
            key={index}
            type='hidden'
            name='existingImages'
            value={image}
          />
        ))}
      </div>

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Update Property
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;