import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaMoon,
} from 'react-icons/fa';

const METHOD_LABELS = { gcash: 'GCash', maya: 'Maya', '': 'Online' };

const BookingConfirmationPage = async ({ params }) => {
  const resolvedParams = await params;
  const bookingId      = resolvedParams.id;

  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  await connectDB();

  const bookingDoc = await Booking.findById(bookingId)
    .populate('property', 'title name location images')
    .lean();

  if (!bookingDoc || bookingDoc.tenant.toString() !== sessionUser.userId) {
    redirect('/bookings');
  }

  // If they haven't submitted a reference yet, send them to pay
  if (bookingDoc.payment_status === 'unpaid') {
    redirect(`/bookings/${bookingId}/payment`);
  }

  const booking      = convertToSerializeableObject(bookingDoc);
  const property     = booking.property;
  const propertyName = property?.title || property?.name || 'Property';
  const locationCity = property?.location?.area || property?.location?.city || '';

  const checkIn  = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    });

  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  const isVerified  = booking.payment_status === 'verified';
  const isSubmitted = booking.payment_status === 'reference_submitted';

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md w-full p-8'>

        {/* ── Status icon + heading ──────────────────────────────────────── */}
        <div className='flex flex-col items-center text-center mb-8'>
          {isVerified ? (
            <>
              <div className='w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4'>
                <FaCheckCircle className='text-green-500 text-4xl' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Booking Confirmed!</h1>
              <p className='text-gray-500 text-sm mt-2'>
                Payment verified. Your reservation is confirmed. See you soon!
              </p>
            </>
          ) : (
            <>
              <div className='w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4'>
                <FaClock className='text-yellow-500 text-4xl' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Awaiting Verification</h1>
              <p className='text-gray-500 text-sm mt-2'>
                Your reference number has been submitted. The host will verify your{' '}
                <span className='font-medium'>{METHOD_LABELS[booking.payment_method]}</span>{' '}
                payment and confirm your booking shortly.
              </p>
            </>
          )}
        </div>

        {/* ── Booking details ────────────────────────────────────────────── */}
        <div className='bg-gray-50 rounded-xl p-5 space-y-4 mb-6'>
          <div>
            <h2 className='font-semibold text-gray-900 text-lg leading-tight'>{propertyName}</h2>
            {locationCity && <p className='text-sm text-gray-500 mt-0.5'>{locationCity}</p>}
          </div>

          <div className='border-t pt-4 space-y-3 text-sm'>
            <div className='flex items-start gap-3'>
              <FaCalendarAlt className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Check-in</p>
                <p className='text-gray-500'>{formatDate(checkIn)}</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <FaCalendarAlt className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Check-out</p>
                <p className='text-gray-500'>{formatDate(checkOut)}</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <FaMoon className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Duration</p>
                <p className='text-gray-500'>
                  {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''} · {booking.rate_type} rate
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <FaUsers className='text-gray-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='font-medium text-gray-700'>Guests</p>
                <p className='text-gray-500'>
                  {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Payment reference */}
          {booking.payment_reference && (
            <div className='border-t pt-4 space-y-1 text-sm'>
              <p className='text-xs text-gray-400 uppercase tracking-wide font-medium'>
                Payment Details
              </p>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Method</span>
                <span className='font-medium text-gray-800'>
                  {METHOD_LABELS[booking.payment_method]}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Reference #</span>
                <span className='font-mono font-medium text-gray-800'>
                  {booking.payment_reference}
                </span>
              </div>
            </div>
          )}

          {/* Total + status */}
          <div className='border-t pt-4 flex justify-between items-center'>
            <div>
              <p className='text-xs text-gray-400 uppercase tracking-wide'>Total Paid</p>
              <p className='text-xl font-bold text-gray-900 mt-0.5'>
                {formatCurrency(booking.total_price)}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                isVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isVerified ? 'Confirmed' : 'Pending'}
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
            className='w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-medium py-2 transition-colors text-sm'
          >
            <FaArrowLeft className='text-xs' /> Back to Listings
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationPage;