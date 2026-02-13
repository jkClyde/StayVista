'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import deleteProperty from '@/app/actions/deleteProperty';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaBed, FaBath, FaEye } from 'react-icons/fa';

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this property? This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeleteLoading(propertyId);

    try {
      const deletePropertyById = deleteProperty.bind(null, propertyId);
      await deletePropertyById();

      toast.success('Property deleted successfully');

      const updatedProperties = properties.filter(
        (property) => property._id !== propertyId
      );

      setProperties(updatedProperties);
    } catch (error) {
      toast.error('Failed to delete property');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle both old and new schema
  const getPropertyName = (property) => property.title || property.name;
  const getPropertyType = (property) => {
    const type = property.propertyType || property.type;
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  const getBathrooms = (property) => property.bathrooms || property.baths;
  const getLocationCity = (property) => property.location?.area || property.location?.city;
  const getLocationState = (property) => property.location?.state;
  const getLocationStreet = (property) => property.location?.street;

  return (
    <div className='grid grid-cols-1 gap-6'>
      {properties.map((property) => (
        <div
          key={property._id}
          className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300'
        >
          <div className='flex flex-col sm:flex-row'>
            {/* Image */}
            <Link
              href={`/listings/${property._id}`}
              className='relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 group'
            >
              {property.images && property.images.length > 0 ? (
                <>
                  <Image
                    className='w-full h-full object-cover'
                    src={property.images[0]}
                    alt={getPropertyName(property)}
                    fill
                    sizes='(max-width: 640px) 100vw, 256px'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center'>
                    <FaEye className='text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                </>
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <FaBed className='text-6xl text-gray-400' />
                </div>
              )}
              
              {/* Property Type Badge */}
              {getPropertyType(property) && (
                <div className='absolute top-3 left-3 bg-[#1A1E43] text-white px-3 py-1 rounded-full text-xs font-semibold'>
                  {getPropertyType(property)}
                </div>
              )}
            </Link>

            {/* Content */}
            <div className='flex-1 p-6'>
              <div className='flex flex-col h-full'>
                {/* Title & Location */}
                <div className='flex-1'>
                  <Link href={`/listings/${property._id}`}>
                    <h3 className='text-xl font-bold text-gray-900 hover:text-[#1A1E43] transition-colors mb-2'>
                      {getPropertyName(property)}
                    </h3>
                  </Link>
                  
                  <div className='flex items-start gap-2 text-gray-600 mb-4'>
                    <FaMapMarkerAlt className='text-orange-500 mt-1 flex-shrink-0' />
                    <p className='text-sm'>
                      {getLocationStreet(property) && `${getLocationStreet(property)}, `}
                      {getLocationCity(property)}
                      {getLocationState(property) && `, ${getLocationState(property)}`}
                    </p>
                  </div>

                  {/* Property Stats */}
                  <div className='flex gap-4 text-sm text-gray-600 mb-4'>
                    {property.beds && (
                      <div className='flex items-center gap-1'>
                        <FaBed className='text-[#1A1E43]' />
                        <span>{property.beds} Beds</span>
                      </div>
                    )}
                    {getBathrooms(property) && (
                      <div className='flex items-center gap-1'>
                        <FaBath className='text-[#1A1E43]' />
                        <span>{getBathrooms(property)} Baths</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-3'>
                  <Link
                    href={`/listings/${property._id}`}
                    className='flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-center inline-flex items-center justify-center gap-2'
                  >
                    <FaEye />
                    View
                  </Link>
                  <Link
                    href={`/listings/${property._id}/edit`}
                    className='flex-1 sm:flex-initial bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-center inline-flex items-center justify-center gap-2'
                  >
                    <FaEdit />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    disabled={deleteLoading === property._id}
                    className='flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'
                    type='button'
                  >
                    {deleteLoading === property._id ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileProperties;