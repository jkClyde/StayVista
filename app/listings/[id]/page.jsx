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
        <div className='min-h-screen flex items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>Invalid Property ID</h1>
            <p className='text-gray-600 mb-8'>The property ID format is not valid.</p>
            <Link href='/listings' className='inline-flex items-center gap-2 bg-[#1A1E43] hover:bg-[#303879] text-white px-6 py-3 rounded-lg transition-colors'>
              <FaArrowLeft /> Back to Listings
            </Link>
          </div>
        </div>
      );
    }
    
    // Fetch property from database
    const propertyDoc = await Property.findById(propertyId).lean();
    
    console.log('Property found:', propertyDoc ? 'Yes' : 'No');
    
    // Handle property not found
    if (!propertyDoc) { 
      return (
        <div className='min-h-screen flex items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>Property Not Found</h1>
            <p className='text-gray-600 mb-8'>The property you're looking for doesn't exist.</p>
            <Link href='/listings' className='inline-flex items-center gap-2 bg-[#1A1E43] hover:bg-[#303879] text-white px-6 py-3 rounded-lg transition-colors'>
              <FaArrowLeft /> Back to Listings
            </Link>
          </div>
        </div>
      );
    }

    // Convert to serializable object
    const property = convertToSerializeableObject(propertyDoc);

    // Check if property has images
    const hasImages = property.images && property.images.length > 0;

    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
        {/* Back Button */}
        <div className='bg-white border-b sticky top-0 z-10 shadow-sm'>
          <div className='container mx-auto py-4 px-4 sm:px-6 lg:px-8'>
            <Link
              href='/listings'
              className='inline-flex items-center gap-2 text-gray-700 hover:text-[#1A1E43] font-medium transition-colors group'
            >
              <FaArrowLeft className='group-hover:-translate-x-1 transition-transform' /> 
              Back to Listings
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className='container mx-auto py-8 px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Mobile: Images First */}
            {hasImages && (
              <div className='lg:hidden'>
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6'>
                  <PropertyImages images={property.images} />
                </div>
                <BookmarkButton property={property} />
              </div>
            )}

            {/* Main Content - 2 columns */}
            <div className='lg:col-span-2'>
              <PropertyDetails property={property} />
            </div>

            {/* Desktop Sidebar - 1 column - Sticky */}
            <aside className='hidden lg:block lg:col-span-1'>
              <div className='sticky top-24 space-y-6'>
                {/* Image Gallery */}
                {hasImages && (
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                    <PropertyImages images={property.images} />
                  </div>
                )}
                
                <BookmarkButton property={property} />
                <ShareButtons property={property} />
                {/* <PropertyContactForm property={property} /> */}
              </div>
            </aside>

            {/* Mobile: Share Buttons Last */}
            <div className='lg:hidden'>
              <ShareButtons property={property} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading property:', error);
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='text-center max-w-md'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Oops!</h1>
          <p className='text-gray-600 mb-2'>An error occurred while loading this property.</p>
          <p className='text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-4 rounded'>{error.message}</p>
          <Link href='/listings' className='inline-flex items-center gap-2 bg-[#1A1E43] hover:bg-[#303879] text-white px-6 py-3 rounded-lg transition-colors'>
            <FaArrowLeft /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }
};

export default PropertyPage;