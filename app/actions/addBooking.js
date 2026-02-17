'use server';

import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE BOOKING  →  save as pending/unpaid  →  go to payment page
// ─────────────────────────────────────────────────────────────────────────────
async function createBooking(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('You must be logged in to book a property');
  }
  const { userId } = sessionUser;

  const propertyId      = formData.get('propertyId');
  const checkIn         = new Date(formData.get('checkIn'));
  const checkOut        = new Date(formData.get('checkOut'));
  const guests          = parseInt(formData.get('guests')) || 1;
  const specialRequests = formData.get('specialRequests') || '';

  // ── Validate dates ──────────────────────────────────────────────────────
  if (checkIn >= checkOut)  throw new Error('Check-out must be after check-in');
  if (checkIn < new Date()) throw new Error('Check-in cannot be in the past');

  // ── Conflict check ──────────────────────────────────────────────────────
  const conflict = await Booking.findOne({
    property: propertyId,
    status:   { $nin: ['cancelled'] },
    $or: [{ check_in: { $lt: checkOut }, check_out: { $gt: checkIn } }],
  });
  if (conflict) throw new Error('Property is not available for the selected dates');

  // ── Fetch property ──────────────────────────────────────────────────────
  const property = await Property.findById(propertyId);
  if (!property) throw new Error('Property not found');
  if (property.owner.toString() === userId)
    throw new Error('You cannot book your own property');

  // ── Calculate price ─────────────────────────────────────────────────────
  const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const rates       = property.rates || {};
  const base        = property.basePricePerNight || rates.nightly || 0;

  let rateType   = 'nightly';
  let totalPrice = totalNights * base;

  if (totalNights >= 28 && rates.monthly) {
    rateType   = 'monthly';
    totalPrice = (totalNights / 30) * rates.monthly;
  } else if (totalNights >= 7 && rates.weekly) {
    rateType   = 'weekly';
    totalPrice = (totalNights / 7) * rates.weekly;
  }

  // ── Save as pending / unpaid ────────────────────────────────────────────
  const newBooking = new Booking({
    property:         propertyId,
    tenant:           userId,
    check_in:         checkIn,
    check_out:        checkOut,
    total_nights:     totalNights,
    total_price:      totalPrice,
    rate_type:        rateType,
    guests,
    special_requests: specialRequests,
    status:           'pending',
    payment_status:   'unpaid',
  });
  await newBooking.save();

  // ── Send to payment page ────────────────────────────────────────────────
  redirect(`/bookings/${newBooking._id}/payment`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT PAYMENT REFERENCE  (guest submits GCash/Maya ref number)
// ─────────────────────────────────────────────────────────────────────────────
async function submitPaymentReference(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('You must be logged in');
  }
  const { userId } = sessionUser;

  const bookingId        = formData.get('bookingId');
  const paymentReference = formData.get('paymentReference')?.trim();
  const paymentMethod    = formData.get('paymentMethod'); // 'gcash' or 'maya'

  if (!paymentReference) throw new Error('Please enter your reference number');
  if (!['gcash', 'maya'].includes(paymentMethod))
    throw new Error('Please select a payment method');

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  // Only the tenant can submit the reference
  if (booking.tenant.toString() !== userId)
    throw new Error('Unauthorized');

  if (booking.status === 'cancelled')
    throw new Error('This booking has been cancelled');

  booking.payment_reference = paymentReference;
  booking.payment_method    = paymentMethod;
  booking.payment_status    = 'reference_submitted';
  await booking.save();

  revalidatePath('/bookings', 'layout');

  // Go to confirmation page to show the "waiting for verification" state
  redirect(`/bookings/${bookingId}/confirmation`);
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY PAYMENT  (owner marks payment as verified and confirms booking)
// ─────────────────────────────────────────────────────────────────────────────
async function verifyPayment(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) throw new Error('User ID is required');
  const { userId } = sessionUser;

  const bookingId = formData.get('bookingId');
  const booking   = await Booking.findById(bookingId).populate('property');
  if (!booking) throw new Error('Booking not found');

  // Only the property owner can verify
  if (booking.property.owner.toString() !== userId)
    throw new Error('Only the property owner can verify payments');

  booking.payment_status = 'verified';
  booking.status         = 'confirmed';
  await booking.save();

  revalidatePath('/bookings', 'layout');
  revalidatePath('/dashboard', 'layout');
}

// ─────────────────────────────────────────────────────────────────────────────
// CANCEL BOOKING
// ─────────────────────────────────────────────────────────────────────────────
async function cancelBooking(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) throw new Error('User ID is required');
  const { userId } = sessionUser;

  const bookingId = formData.get('bookingId');
  const booking   = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const property = await Property.findById(booking.property);
  const isOwner  = property.owner.toString() === userId;
  const isTenant = booking.tenant.toString() === userId;

  if (!isOwner && !isTenant)
    throw new Error('You are not authorized to cancel this booking');
  if (booking.status === 'cancelled')
    throw new Error('Booking is already cancelled');

  booking.status = 'cancelled';
  await booking.save();

  revalidatePath('/bookings', 'layout');
  revalidatePath('/listings',  'layout');
}

// ─────────────────────────────────────────────────────────────────────────────
// GET BOOKED DATES  (call from Server Components)
// ─────────────────────────────────────────────────────────────────────────────
async function getBookedDates(propertyId) {
  await connectDB();

  const bookings = await Booking.find({
    property: propertyId,
    status:   { $nin: ['cancelled'] },
  }).select('check_in check_out');

  const bookedDates = [];
  for (const { check_in, check_out } of bookings) {
    const current = new Date(check_in);
    while (current < check_out) {
      bookedDates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  }
  return bookedDates;
}

export {
  createBooking,
  submitPaymentReference,
  verifyPayment,
  cancelBooking,
  getBookedDates,
};