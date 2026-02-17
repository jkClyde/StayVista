'use client';

import { useTransition, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cancelBooking } from '@/app/actions/addBooking';
import {
  FaCalendarAlt, FaUsers, FaMoon,
  FaSpinner, FaMapMarkerAlt, FaMoneyBillWave,
} from 'react-icons/fa';

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
  completed: 'bg-gray-100   text-gray-600',
};

const PAYMENT_STYLES = {
  unpaid:               'bg-red-50    text-red-500',
  reference_submitted:  'bg-yellow-50 text-yellow-600',
  verified:             'bg-green-50  text-green-600',
  refunded:             'bg-gray-50   text-gray-500',
};

const PAYMENT_LABELS = {
  unpaid:              'Unpaid',
  reference_submitted: 'Ref # submitted — awaiting verification',
  verified:            'Payment verified ✓',
  refunded:            'Refunded',
};

const METHOD_LABELS = { gcash: 'GCash', maya: 'Maya', '': '' };

export default function BookingCard({ booking, isPast = false }) {
  const [isPending,    startTransition] = useTransition();
  const [cancelled,    setCancelled]    = useState(false);
  const [error,        setError]        = useState('');
  const [showConfirm,  setShowConfirm]  = useState(false);

  const property     = booking.property;
  const propertyName = property?.title || property?.name || 'Property';
  const locationCity = property?.location?.area || property?.location?.city || '';
  const image        = property?.images?.[0] || null;

  const checkIn  = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;

  const currentStatus = cancelled ? 'cancelled' : booking.status;
  const canCancel =
    !isPast && !cancelled &&
    currentStatus !== 'cancelled' && currentStatus !== 'completed';

  const isUnpaid = booking.payment_status === 'unpaid' && !cancelled;

  function handleCancel() {
    setError('');
    const formData = new FormData();
    formData.set('bookingId', booking._id);
    startTransition(async () => {
      try {
        await cancelBooking(formData);
        setCancelled(true);
        setShowConfirm(false);
      } catch (err) {
        setError(err.message || 'Could not cancel. Please try again.');
        setShowConfirm(false);
      }
    });
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
      isPast || cancelled ? 'border-gray-100 opacity-75' : 'border-gray-200'
    }`}>
      <div className='flex flex-col sm:flex-row'>

        {/* ── Thumbnail ──────────────────────────────────────────────────── */}
        <div className='relative sm:w-44 h-44 sm:h-auto flex-shrink-0 bg-gray-100'>
          {image ? (
            <Image src={image} alt={propertyName} fill className='object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-300 text-4xl'>🏠</div>
          )}
        </div>

        {/* ── Details ────────────────────────────────────────────────────── */}
        <div className='flex-1 p-5 flex flex-col justify-between gap-3'>

          {/* Top row: name + status */}
          <div className='flex items-start justify-between gap-4'>
            <div>
              <Link
                href={`/listings/${property?._id}`}
                className='text-lg font-bold text-gray-900 hover:text-[#1A1E43] transition-colors leading-tight'
              >
                {propertyName}
              </Link>
              {locationCity && (
                <p className='flex items-center gap-1 text-sm text-gray-500 mt-0.5'>
                  <FaMapMarkerAlt className='text-xs' />
                  {locationCity}
                </p>
              )}
            </div>
            <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              STATUS_STYLES[currentStatus] ?? STATUS_STYLES.pending
            }`}>
              {currentStatus}
            </span>
          </div>

          {/* Stats */}
          <div className='flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600'>
            <span className='flex items-center gap-1.5'>
              <FaCalendarAlt className='text-gray-400 text-xs' />
              {formatDate(checkIn)} → {formatDate(checkOut)}
            </span>
            <span className='flex items-center gap-1.5'>
              <FaMoon className='text-gray-400 text-xs' />
              {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}
            </span>
            <span className='flex items-center gap-1.5'>
              <FaUsers className='text-gray-400 text-xs' />
              {booking.guests} guest{booking.guests > 1 ? 's' : ''}
            </span>
          </div>

          {/* Payment status row */}
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${
            PAYMENT_STYLES[booking.payment_status] ?? PAYMENT_STYLES.unpaid
          }`}>
            <FaMoneyBillWave />
            <span>{PAYMENT_LABELS[booking.payment_status]}</span>
            {booking.payment_method && (
              <span className='ml-1 text-gray-400'>
                via {METHOD_LABELS[booking.payment_method]}
              </span>
            )}
            {booking.payment_reference && (
              <span className='ml-auto font-mono text-gray-500'>
                Ref: {booking.payment_reference}
              </span>
            )}
          </div>

          {/* Price + actions */}
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <div>
              <span className='text-xl font-bold text-gray-900'>
                {formatCurrency(booking.total_price)}
              </span>
              <span className='text-xs text-gray-400 ml-1'>total</span>
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
              {/* Pay Now button if still unpaid */}
              {isUnpaid && (
                <Link
                  href={`/bookings/${booking._id}/payment`}
                  className='px-4 py-2 bg-[#1A1E43] hover:bg-[#303879] text-white text-sm font-semibold rounded-lg transition-colors'
                >
                  Pay Now
                </Link>
              )}

              {/* Cancel */}
              {canCancel && (
                showConfirm ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>Cancel booking?</span>
                    <button
                      onClick={handleCancel}
                      disabled={isPending}
                      className='flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold rounded-lg transition-colors'
                    >
                      {isPending ? <FaSpinner className='animate-spin' /> : 'Yes, cancel'}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className='px-3 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors'
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className='px-4 py-2 border border-red-200 hover:border-red-400 text-red-600 text-sm font-medium rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                )
              )}
            </div>
          </div>

          {error && (
            <p className='text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2'>⚠ {error}</p>
          )}
          {cancelled && (
            <p className='text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2'>
              Booking cancelled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}