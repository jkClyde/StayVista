export const runtime = 'nodejs';

import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import PropertyDetails from '@/components/PropertyDetails';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyImages from '@/components/PropertyImages';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import PropertyContactForm from '@/components/PropertyContactForm';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { notFound } from 'next/navigation';

const PropertyPage = async ({ params }) => {
  try {
    await connectDB();
    
    // Await params in Next.js 15
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;
    
    // Validate MongoDB ID format
    if (!propertyId || !propertyId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid MongoDB ID format:', propertyId);
      return (
        <div className='text-center mt-10 px-4'>
          <h1 className='text-2xl font-bold'>Invalid Property ID</h1>
          <Link href='/properties' className='text-[#1A1E43] hover:text-[#303879] mt-4 inline-block'>
            <FaArrowLeft className='inline mr-2' /> Back to Properties
          </Link>
        </div>
      );
    }
    
    // Fetch property from database
    const propertyDoc = await Property.findById(propertyId).lean();
    
    console.log('Property found:', propertyDoc ? 'Yes' : 'No');
    
    // Handle property not found
    if (!propertyDoc) { 
      return (
        <div className='text-center mt-10 px-4'>
          <h1 className='text-2xl font-bold mb-4'>Property Not Found</h1>
          <p className='text-gray-600 mb-4'>The property you're looking for doesn't exist.</p>
          <Link href='/properties' className='text-[#1A1E43] hover:text-[#303879]'>
            <FaArrowLeft className='inline mr-2' /> Back to Properties
          </Link>
        </div>
      );
    }

    // Convert to serializable object
    const property = convertToSerializeableObject(propertyDoc);

    // Check if property has images
    const hasImages = property.images && property.images.length > 0;

    return (
      <>
        {hasImages && <PropertyHeaderImage image={property.images[0]} />}
        
        <section>
          <div className='container m-auto py-6 px-6'>
            <Link
              href='/properties'
              className='text-[#1A1E43] hover:text-[#303879] flex items-center'
            >
              <FaArrowLeft className='mr-2' /> Back to Properties
            </Link>
          </div>
        </section>

        <section className='bg-blue-50'>
          <div className='container m-auto py-10 px-6'>
            <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
              <PropertyDetails property={property} />

              {/* Sidebar */}
              <aside className='space-y-4'>
                <BookmarkButton property={property} />
                <ShareButtons property={property} />
                {/* <PropertyContactForm property={property} /> */}
              </aside>
            </div>
          </div>
        </section>

        {hasImages && <PropertyImages images={property.images} />}
      </>
    );
  } catch (error) {
    console.error('Error loading property:', error);
    return (
      <div className='text-center mt-10 px-4'>
        <h1 className='text-2xl font-bold mb-4'>Error Loading Property</h1>
        <p className='text-gray-600 mb-4'>An error occurred while loading this property.</p>
        <p className='text-sm text-gray-500 mb-4'>{error.message}</p>
        <Link href='/properties' className='text-[#1A1E43] hover:text-[#303879]'>
          <FaArrowLeft className='inline mr-2' /> Back to Properties
        </Link>
      </div>
    );
  }
};

export default PropertyPage;