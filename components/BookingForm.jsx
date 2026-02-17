'use client';

import { useState, useEffect, useTransition } from 'react';
import { createBooking } from '@/app/actions/addBooking';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';

export default function BookingForm({
  property,
  bookedDates = [],       // ["2025-03-01", "2025-03-02", ...] from getBookedDates()
  initialCheckIn  = '',   // pre-filled from ?checkIn= URL param
  initialCheckOut = '',   // pre-filled from ?checkOut= URL param
}) {
  const [checkIn,  setCheckIn]  = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests,   setGuests]   = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [priceBreakdown, setPriceBreakdown]   = useState(null);
  const [error,    setError]    = useState('');
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];
  const pricePerNight =
    property.basePricePerNight ||
    property.rates?.nightly ||
    0;

  // ── Recalculate price whenever dates change ────────────────────────────
  useEffect(() => {
    if (!checkIn || !checkOut) { setPriceBreakdown(null); return; }

    const start = new Date(checkIn);
    const end   = new Date(checkOut);
    if (end <= start) { setPriceBreakdown(null); return; }

    const nights  = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const rates   = property.rates || {};
    const base    = pricePerNight;

    let rateType     = 'nightly';
    let pricePerUnit = base;
    let units        = nights;
    let total        = nights * base;

    if (nights >= 28 && rates.monthly) {
      rateType     = 'monthly';
      pricePerUnit = rates.monthly;
      units        = parseFloat((nights / 30).toFixed(2));
      total        = units * rates.monthly;
    } else if (nights >= 7 && rates.weekly) {
      rateType     = 'weekly';
      pricePerUnit = rates.weekly;
      units        = parseFloat((nights / 7).toFixed(2));
      total        = units * rates.weekly;
    }

    setPriceBreakdown({ nights, rateType, pricePerUnit, units, total });
  }, [checkIn, checkOut, property]);

  // ── Validate before submit ─────────────────────────────────────────────
  function validate() {
    if (!checkIn || !checkOut) return 'Please select check-in and check-out dates.';
    if (new Date(checkOut) <= new Date(checkIn))
      return 'Check-out must be after check-in.';

    // Walk every day in the range and check against bookedDates
    const current = new Date(checkIn);
    const end     = new Date(checkOut);
    while (current < end) {
      const iso = current.toISOString().split('T')[0];
      if (bookedDates.includes(iso))
        return `${new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} is already booked. Please choose different dates.`;
      current.setDate(current.getDate() + 1);
    }

    return null;
  }

  // ── Submit via server action ───────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');

    const formData = new FormData();
    formData.set('propertyId',      property._id.toString());
    formData.set('checkIn',         checkIn);
    formData.set('checkOut',        checkOut);
    formData.set('guests',          guests.toString());
    formData.set('specialRequests', specialRequests);

    startTransition(async () => {
      try {
        await createBooking(formData);
        // createBooking calls redirect() internally — this line only runs on error
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;

  const formatUnitLabel = (breakdown) => {
    const { rateType, pricePerUnit, nights, units } = breakdown;
    if (rateType === 'monthly')
      return `${formatCurrency(pricePerUnit)} × ${units} mo.`;
    if (rateType === 'weekly')
      return `${formatCurrency(pricePerUnit)} × ${units} wk.`;
    return `${formatCurrency(pricePerUnit)} × ${nights} night${nights > 1 ? 's' : ''}`;
  };

  return (
    <div className='bg-white rounded-xl shadow-md border border-gray-100 p-6'>
      {/* Header */}
      <div className='mb-5'>
        <div className='flex items-baseline gap-2'>
          <span className='text-2xl font-bold text-gray-900'>
            {formatCurrency(pricePerNight)}
          </span>
          <span className='text-gray-500 text-sm'>/ night</span>
        </div>
        {property.rates?.weekly && (
          <p className='text-xs text-gray-400 mt-0.5'>
            {formatCurrency(property.rates.weekly)} / week ·{' '}
            {formatCurrency(property.rates.monthly)} / month
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* ── Date picker row ─────────────────────────────────────────── */}
        <div className='grid grid-cols-2 gap-2 border border-gray-200 rounded-xl overflow-hidden'>
          <div className='p-3 border-r border-gray-200'>
            <label className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1'>
              Check-in
            </label>
            <input
              type='date'
              name='checkIn'
              min={today}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) setCheckOut('');
                setError('');
              }}
              required
              className='w-full text-sm text-gray-800 focus:outline-none bg-transparent'
            />
          </div>
          <div className='p-3'>
            <label className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1'>
              Check-out
            </label>
            <input
              type='date'
              name='checkOut'
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => { setCheckOut(e.target.value); setError(''); }}
              required
              className='w-full text-sm text-gray-800 focus:outline-none bg-transparent'
            />
          </div>
        </div>

        {/* ── Booked dates notice ──────────────────────────────────────── */}
        {bookedDates.length > 0 && (
          <p className='flex items-center gap-1.5 text-xs text-gray-400'>
            <FaCalendarAlt className='text-gray-300' />
            Some dates may be unavailable — you&apos;ll be notified if your selection overlaps.
          </p>
        )}

        {/* ── Guests ──────────────────────────────────────────────────── */}
        <div className='border border-gray-200 rounded-xl p-3'>
          <label className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1'>
            Guests
          </label>
          <select
            name='guests'
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className='w-full text-sm text-gray-800 focus:outline-none bg-transparent'
          >
            {Array.from({ length: property.maxGuests || 10 }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n} guest{n > 1 ? 's' : ''}
                </option>
              )
            )}
          </select>
        </div>

        {/* ── Special requests ─────────────────────────────────────────── */}
        <div className='border border-gray-200 rounded-xl p-3'>
          <label className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1'>
            Special Requests{' '}
            <span className='normal-case font-normal text-gray-400'>(optional)</span>
          </label>
          <textarea
            name='specialRequests'
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={2}
            placeholder='Early check-in, dietary needs, etc.'
            className='w-full text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent resize-none'
          />
        </div>

        {/* ── Error ───────────────────────────────────────────────────── */}
        {error && (
          <div className='flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
            <span className='mt-0.5'>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Price breakdown ──────────────────────────────────────────── */}
        {priceBreakdown && priceBreakdown.nights > 0 && (
          <div className='border-t pt-4 space-y-2 text-sm'>
            <div className='flex justify-between text-gray-600'>
              <span>{formatUnitLabel(priceBreakdown)}</span>
              <span>{formatCurrency(priceBreakdown.total)}</span>
            </div>
            {priceBreakdown.rateType !== 'nightly' && (
              <p className='text-xs text-green-600 font-medium'>
                🎉{' '}
                {priceBreakdown.rateType === 'weekly' ? 'Weekly' : 'Monthly'} rate
                applied — you save vs. nightly!
              </p>
            )}
            <div className='flex justify-between font-bold text-gray-900 border-t pt-2 text-base'>
              <span>Total</span>
              <span>{formatCurrency(priceBreakdown.total)}</span>
            </div>
          </div>
        )}

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <button
          type='submit'
          disabled={isPending}
          className='w-full flex items-center justify-center gap-2 bg-[#1A1E43] hover:bg-[#303879] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors duration-200'
        >
          {isPending ? (
            <>
              <FaSpinner className='animate-spin' />
              Reserving…
            </>
          ) : (
            'Reserve'
          )}
        </button>

        <p className='text-center text-xs text-gray-400'>
          You won&apos;t be charged yet
        </p>
      </form>
    </div>
  );
}