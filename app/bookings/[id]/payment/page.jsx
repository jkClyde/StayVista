import connectDB from '@/config/database';
import Booking from '@/models/Booking';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
import PaymentPageClient from '@/components/PaymentPageClient';

const PaymentPage = async ({ params }) => {
  const resolvedParams = await params;
  const bookingId      = resolvedParams.id;

  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  await connectDB();

  const bookingDoc = await Booking.findById(bookingId)
    .populate('property', 'title name')
    .lean();

  // Guard: must exist and belong to this user
  if (!bookingDoc || bookingDoc.tenant.toString() !== sessionUser.userId) {
    redirect('/bookings');
  }

  // If already paid/submitted, skip this page
  if (bookingDoc.payment_status !== 'unpaid') {
    redirect(`/bookings/${bookingId}/confirmation`);
  }

  // If cancelled, go back to bookings list
  if (bookingDoc.status === 'cancelled') {
    redirect('/bookings');
  }

  const booking = convertToSerializeableObject(bookingDoc);

  return <PaymentPageClient booking={booking} />;
};

export default PaymentPage;