'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function updateProperty(propertyId, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const existingProperty = await Property.findById(propertyId);

  if (!existingProperty) {
    throw new Error('Property not found');
  }

  // Verify ownership
  if (existingProperty.owner.toString() !== userId) {
    throw new Error('Current user does not own this property.');
  }

  const amenities = formData.getAll('amenities');

  const propertyData = {
    owner: userId,
    title: formData.get('title'),
    description: formData.get('description'),
    propertyType: formData.get('propertyType'),
    location: {
      area: formData.get('location.area'),
      street: formData.get('location.street'),
      landmark: formData.get('location.landmark'),
    },
    maxGuests: formData.get('maxGuests'),
    bedrooms: formData.get('bedrooms'),
    beds: formData.get('beds'),
    bathrooms: formData.get('bathrooms'),
    basePricePerNight: formData.get('basePricePerNight'),
    amenities,
    houseRules: formData.get('houseRules'),
    checkInTime: formData.get('checkInTime') || '14:00',
    checkOutTime: formData.get('checkOutTime') || '12:00',
  };

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData,
    { new: true } // Return the updated document
  );

  revalidatePath('/', 'layout');

  redirect(`/listings/${updatedProperty._id}`);
}

export default updateProperty;