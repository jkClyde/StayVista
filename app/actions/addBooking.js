'use server';
import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─────────────────────────────────────────────
// CREATE BOOKING
// Called from your BookingForm component
// ─────────────────────────────────────────────
async function createBooking(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('You must be logged in to book a property');
  }

  const { userId } = sessionUser;

  const propertyId = formData.get('propertyId');
  const checkIn = new Date(formData.get('checkIn'));
  const checkOut = new Date(formData.get('checkOut'));
  const guests = parseInt(formData.get('guests')) || 1;
  const specialRequests = formData.get('specialRequests') || '';

  // ── Validate dates ──────────────────────────
  if (checkIn >= checkOut) {
    throw new Error('Check-out date must be after check-in date');
  }

  if (checkIn < new Date()) {
    throw new Error('Check-in date cannot be in the past');
  }

  // ── Check for conflicting bookings ──────────
  // Overlap condition: existing check_in < new check_out AND existing check_out > new check_in
  const conflict = await Booking.findOne({
    property: propertyId,
    status: { $nin: ['cancelled'] },
    $or: [{ check_in: { $lt: checkOut }, check_out: { $gt: checkIn } }],
  });

  if (conflict) {
    throw new Error('Property is not available for the selected dates');
  }

  // ── Fetch property to calculate price ───────
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error('Property not found');
  }

  // Prevent owner from booking their own property
  if (property.owner.toString() === userId) {
    throw new Error('You cannot book your own property');
  }

  // ── Calculate total nights and price ────────
  const totalNights = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
  );

  let rateType = 'nightly';
  let totalPrice = totalNights * (property.basePricePerNight || 0);

  // Apply best available rate (monthly > weekly > nightly)
  if (property.rates) {
    if (totalNights >= 28 && property.rates.monthly) {
      rateType = 'monthly';
      totalPrice = (totalNights / 30) * property.rates.monthly;
    } else if (totalNights >= 7 && property.rates.weekly) {
      rateType = 'weekly';
      totalPrice = (totalNights / 7) * property.rates.weekly;
    } else if (property.rates.nightly) {
      rateType = 'nightly';
      totalPrice = totalNights * property.rates.nightly;
    }
  }

  // ── Save booking ─────────────────────────────
  const newBooking = new Booking({
    property: propertyId,
    tenant: userId,
    check_in: checkIn,
    check_out: checkOut,
    total_nights: totalNights,
    total_price: totalPrice,
    rate_type: rateType,
    guests,
    special_requests: specialRequests,
    status: 'pending',
    payment_status: 'unpaid',
  });

  await newBooking.save();

  revalidatePath('/bookings', 'layout');

  redirect(`/bookings/${newBooking._id}/confirmation`);
}

// ─────────────────────────────────────────────
// CANCEL BOOKING
// Called from the user's bookings dashboard
// ─────────────────────────────────────────────
async function cancelBooking(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;
  const bookingId = formData.get('bookingId');

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Only the tenant or the property owner can cancel
  const property = await Property.findById(booking.property);
  const isOwner = property.owner.toString() === userId;
  const isTenant = booking.tenant.toString() === userId;

  if (!isOwner && !isTenant) {
    throw new Error('You are not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  booking.status = 'cancelled';
  await booking.save();

  revalidatePath('/bookings', 'layout');
  revalidatePath('/listings', 'layout');
}

// ─────────────────────────────────────────────
// CONFIRM BOOKING (owner confirms a pending booking)
// ─────────────────────────────────────────────
async function confirmBooking(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;
  const bookingId = formData.get('bookingId');

  const booking = await Booking.findById(bookingId).populate('property');

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Only property owner can confirm
  if (booking.property.owner.toString() !== userId) {
    throw new Error('Only the property owner can confirm bookings');
  }

  if (booking.status !== 'pending') {
    throw new Error(`Cannot confirm a booking with status: ${booking.status}`);
  }

  booking.status = 'confirmed';
  await booking.save();

  revalidatePath('/bookings', 'layout');
}

// ─────────────────────────────────────────────
// GET BOOKED DATES  (used to disable dates on the calendar)
// This is a plain async function — call it in a Server Component
// ─────────────────────────────────────────────
async function getBookedDates(propertyId) {
  await connectDB();

  const bookings = await Booking.find({
    property: propertyId,
    status: { $nin: ['cancelled'] },
  }).select('check_in check_out');

  // Expand each booking range into individual ISO date strings
  const bookedDates = [];

  for (const { check_in, check_out } of bookings) {
    const current = new Date(check_in);
    while (current < check_out) {
      bookedDates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  return bookedDates; // e.g. ["2025-03-01", "2025-03-02", ...]
}

export {
  createBooking,
  cancelBooking,
  confirmBooking,
  getBookedDates,
};