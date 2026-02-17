import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarCheck, FaHistory } from 'react-icons/fa';
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

  const now      = new Date();
  const upcoming = bookings.filter((b) => new Date(b.check_out) >= now && b.status !== 'cancelled');
  const past     = bookings.filter((b) => new Date(b.check_out) <  now || b.status === 'cancelled');

  return (
    <div className='min-h-screen' style={{ background: '#F4F6FB' }}>

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1A1E43 0%, #2d3270 60%, #303879 100%)' }}>
        {/* Back link */}
        <div className='px-6 sm:px-10 lg:px-16 pt-6 max-w-[1620px] mx-auto'>
          <Link
            href='/listings'
            className='inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium transition-colors group text-sm'
          >
            <FaArrowLeft className='group-hover:-translate-x-1 transition-transform text-xs' />
            Back to Listings
          </Link>
        </div>

        {/* Title block */}
        <div className='px-6 sm:px-10 lg:px-16 pt-8 pb-12 max-w-[1620px] mx-auto'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white tracking-tight'>
            My Bookings
          </h1>
          <p className='text-blue-200 mt-2 text-base'>
            {bookings.length === 0
              ? "You haven't made any reservations yet."
              : `${upcoming.length} upcoming · ${past.length} past`}
          </p>

          {/* Summary pills */}
          {bookings.length > 0 && (
            <div className='flex flex-wrap gap-3 mt-6 '>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white'>
                <span className='w-2 h-2 rounded-full bg-emerald-400 inline-block' />
                {upcoming.length} Upcoming
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white'>
                <span className='w-2 h-2 rounded-full bg-blue-300 inline-block' />
                {bookings.length} Total
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className='px-6 sm:px-10 lg:px-16 py-10 max-w-[1620px] mx-auto'>

        {/* Empty state */}
        {bookings.length === 0 && (
          <div className='bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center'>
            <div
              className='w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center text-4xl'
              style={{ background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)' }}
            >
              🏠
            </div>
            <h2 className='text-xl font-bold text-gray-800 mb-2'>No bookings yet</h2>
            <p className='text-gray-500 mb-8 text-sm'>Browse listings and make your first reservation.</p>
            <Link
              href='/listings'
              className='inline-flex items-center gap-2 text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5'
              style={{ background: 'linear-gradient(135deg, #1A1E43, #303879)' }}
            >
              Browse Listings →
            </Link>
          </div>
        )}

        {/* ── Upcoming section ──────────────────────────────────────────── */}
        {upcoming.length > 0 && (
          <section className='mb-12'>
            <div className='flex items-center gap-3 mb-5'>
              <div
                className='w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}
              >
                <FaCalendarCheck className='text-emerald-600 text-sm' />
              </div>
              <div>
                <h2 className='text-xl font-bold text-gray-900 leading-none'>Upcoming</h2>
                <p className='text-xs text-gray-400 mt-0.5'>
                  {upcoming.length} reservation{upcoming.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className='flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2' />
            </div>

            <div className='space-y-4'>
              {upcoming.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* ── Past & Cancelled section ──────────────────────────────────── */}
        {past.length > 0 && (
          <section>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100'>
                <FaHistory className='text-gray-400 text-sm' />
              </div>
              <div>
                <h2 className='text-xl font-bold text-gray-500 leading-none'>Past &amp; Cancelled</h2>
                <p className='text-xs text-gray-400 mt-0.5'>
                  {past.length} reservation{past.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className='flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2' />
            </div>

            <div className='space-y-4 opacity-70'>
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