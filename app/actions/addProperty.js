'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function addProperty(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const amenities = formData.getAll('amenities');
  const images = formData.getAll('images').filter((image) => image.name !== '');

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

  const imageUrls = [];

  for (const imageFile of images) {
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
  }

  propertyData.images = imageUrls;

  const newProperty = new Property(propertyData);
  await newProperty.save();

  revalidatePath('/', 'layout');

  redirect(`/listings/${newProperty._id}`);
}

export default addProperty;