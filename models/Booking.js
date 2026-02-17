import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    total_nights: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    rate_type: {
      type: String,
      enum: ['nightly', 'weekly', 'monthly'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    payment_status: {
      type: String,
      // unpaid            → just booked, hasn't paid yet
      // reference_submitted → guest sent ref number, waiting for owner to verify
      // verified           → owner confirmed the payment
      // refunded           → owner issued a refund
      enum: ['unpaid', 'reference_submitted', 'verified', 'refunded'],
      default: 'unpaid',
    },
    // GCash or Maya reference number submitted by the guest
    payment_reference: {
      type: String,
      default: '',
    },
    // Which app they paid with
    payment_method: {
      type: String,
      enum: ['gcash', 'maya', ''],
      default: '',
    },
    guests: {
      type: Number,
      default: 1,
    },
    special_requests: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ property: 1, check_in: 1, check_out: 1 });

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;