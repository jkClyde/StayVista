import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import Link from 'next/link';
import { FaCheckCircle, FaArrowLeft, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { notFound, redirect } from 'next/navigation';

const BookingConfirmationPage = async ({ params }) => {
  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  const bookingDoc = await Booking.findById(bookingId)
    .populate('property', 'title name location images basePricePerNight')
    .lean();

  if (!bookingDoc) notFound();

  // Only the tenant can view their own confirmation
  if (bookingDoc.tenant.toString() !== sessionUser.userId) {
    redirect('/');
  }

  const booking  = convertToSerializeableObject(bookingDoc);
  const property = booking.property;

  const propertyName = property.title || property.name;
  const locationCity = property.location?.area || property.location?.city;

  const checkIn  = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md w-full p-8'>

        {/* Success icon */}
        <div className='flex flex-col items-center text-center mb-8'>
          <div className='w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4'>
            <FaCheckCircle className='text-green-500 text-4xl' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>Booking Requested!</h1>
          <p className='text-gray-500 text-sm mt-2'>
            Your reservation is <span className='font-semibold text-yellow-600'>pending confirmation</span> from the host.
            You&apos;ll be notified once it&apos;s confirmed.
          </p>
        </div>

        {/* Booking details card */}
        <div className='bg-gray-50 rounded-xl p-5 space-y-4 mb-6'>
          <h2 className='font-semibold text-gray-900 text-lg'>{propertyName}</h2>
          {locationCity && (
            <p className='text-sm text-gray-500 -mt-2'>{locationCity}</p>
          )}

          <div className='border-t pt-4 space-y-3'>
            <div className='flex items-start gap-3 text-sm'>
              <FaCalendarAlt className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Check-in</p>
                <p className='text-gray-500'>{formatDate(checkIn)}</p>
              </div>
            </div>
            <div className='flex items-start gap-3 text-sm'>
              <FaCalendarAlt className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Check-out</p>
                <p className='text-gray-500'>{formatDate(checkOut)}</p>
              </div>
            </div>
            <div className='flex items-start gap-3 text-sm'>
              <FaUsers className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Guests</p>
                <p className='text-gray-500'>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div className='border-t pt-4 flex justify-between items-center'>
            <div>
              <p className='text-xs text-gray-400 uppercase tracking-wide'>
                {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''} · {booking.rate_type} rate
              </p>
              <p className='text-xl font-bold text-gray-900 mt-0.5'>
                {formatCurrency(booking.total_price)}
              </p>
            </div>
            <span className='px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 uppercase tracking-wide'>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Booking reference */}
        <p className='text-center text-xs text-gray-400 mb-6'>
          Booking ref:{' '}
          <span className='font-mono text-gray-500'>{booking._id}</span>
        </p>

        {/* Actions */}
        <div className='flex flex-col gap-3'>
          <Link
            href='/bookings'
            className='w-full flex items-center justify-center gap-2 bg-[#1A1E43] hover:bg-[#303879] text-white font-semibold py-3 rounded-xl transition-colors'
          >
            View My Bookings
          </Link>
          <Link
            href='/listings'
            className='w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors text-sm'
          >
            <FaArrowLeft className='text-xs' /> Back to Listings
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationPage;