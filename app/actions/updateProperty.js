'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

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
  
  // Get existing images that weren't deleted
  const existingImages = formData.getAll('existingImages');
  
  // Get new images to upload
  const newImageFiles = formData
    .getAll('images')
    .filter((image) => image.name !== '' && image.size > 0);

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

  // Start with existing images (in the order they were arranged)
  const imageUrls = [...existingImages];

  // Upload new images and append to the array
  if (newImageFiles.length > 0) {
    for (const imageFile of newImageFiles) {
      try {
        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        const imageBase64 = imageData.toString('base64');

        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          {
            folder: 'propertypulse',
          }
        );

        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload images. Please try again.');
      }
    }
  }

  propertyData.images = imageUrls;

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData,
    { new: true }
  );

  revalidatePath('/', 'layout');

  redirect(`/listings/${updatedProperty._id}`);
}

export default updateProperty;