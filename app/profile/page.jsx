import Image from 'next/image';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import profileDefault from '@/assets/images/profile.png';
import ProfileProperties from '@/components/ProfileProperties';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import { FaHome, FaEnvelope, FaUser } from 'react-icons/fa';
import Link from 'next/link';

const ProfilePage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();

  const { userId } = sessionUser;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const propertiesDocs = await Property.find({ owner: userId }).lean();
  const properties = propertiesDocs.map(convertToSerializeableObject);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-[#1A1E43] to-[#303879] text-white py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-bold'>Your Profile</h1>
          <p className='text-gray-200 mt-2'>Manage your account and listings</p>
        </div>
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar - Profile Info */}
          <aside className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24'>
              {/* Profile Picture */}
              <div className='flex flex-col items-center mb-6'>
                <div className='relative mb-4'>
                  <Image
                    className='w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg'
                    src={sessionUser.user.image || profileDefault}
                    width={128}
                    height={128}
                    alt='User Profile'
                  />
                  <div className='absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white'></div>
                </div>
                <h2 className='text-xl font-bold text-gray-900 text-center'>
                  {sessionUser.user.name}
                </h2>
                <p className='text-sm text-gray-500 mt-1'>Property Owner</p>
              </div>

              {/* Contact Info */}
              <div className='space-y-4 pt-6 border-t border-gray-200'>
                <div className='flex items-start gap-3'>
                  <FaUser className='text-gray-400 mt-1 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Name</p>
                    <p className='text-sm text-gray-900 font-medium break-words'>
                      {sessionUser.user.name}
                    </p>
                  </div>
                </div>
                
                <div className='flex items-start gap-3'>
                  <FaEnvelope className='text-gray-400 mt-1 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Email</p>
                    <p className='text-sm text-gray-900 font-medium break-words'>
                      {sessionUser.user.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <FaHome className='text-gray-400 mt-1 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Total Listings</p>
                    <p className='text-2xl font-bold text-[#1A1E43]'>
                      {properties.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Property Listings */}
          <main className='lg:col-span-3'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>Your Listings</h2>
                  <p className='text-gray-500 mt-1'>
                    {properties.length === 0
                      ? 'No properties yet'
                      : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
                  </p>
                </div>
                <Link
                  href='/listings/add'
                  className='bg-[#1A1E43] hover:bg-[#303879] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2'
                >
                  <FaHome />
                  Add Property
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className='text-center py-16'>
                  <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4'>
                    <FaHome className='text-4xl text-gray-400' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    No listings yet
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Start by adding your first property listing
                  </p>
                  <Link
                    href='/listings/add'
                    className='bg-[#1A1E43] hover:bg-[#303879] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2'
                  >
                    <FaHome />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <ProfileProperties properties={properties} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;