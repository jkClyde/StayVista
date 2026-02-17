import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import BookingCard from '@/components/BookingCard';

const BookingsPage = async () => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  await connectDB();

  const bookingDocs = await Booking.find({ tenant: sessionUser.userId })
    .populate('property', 'title name images location basePricePerNight')
    .sort({ createdAt: -1 })
    .lean();

  const bookings = bookingDocs.map((b) => convertToSerializeableObject(b));

  // Split into upcoming and past
  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.check_out) >= now && b.status !== 'cancelled');
  const past     = bookings.filter((b) => new Date(b.check_out) <  now || b.status === 'cancelled');

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Header bar */}
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

      <div className='container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Bookings</h1>
        <p className='text-gray-500 mb-10'>
          {bookings.length === 0
            ? "You haven't made any bookings yet."
            : `${bookings.length} booking${bookings.length > 1 ? 's' : ''} total`}
        </p>

        {bookings.length === 0 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center'>
            <p className='text-5xl mb-4'>🏠</p>
            <p className='text-gray-500 mb-6'>Browse listings and make your first reservation.</p>
            <Link
              href='/listings'
              className='inline-flex items-center gap-2 bg-[#1A1E43] hover:bg-[#303879] text-white font-semibold px-6 py-3 rounded-xl transition-colors'
            >
              Browse Listings
            </Link>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className='mb-10'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-500 rounded-full inline-block' />
              Upcoming ({upcoming.length})
            </h2>
            <div className='space-y-4'>
              {upcoming.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Past / Cancelled */}
        {past.length > 0 && (
          <section>
            <h2 className='text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <span className='w-2 h-2 bg-gray-300 rounded-full inline-block' />
              Past &amp; Cancelled ({past.length})
            </h2>
            <div className='space-y-4 opacity-80'>
              {past.map((booking) => (
                <BookingCard key={booking._id} booking={booking} isPast />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;