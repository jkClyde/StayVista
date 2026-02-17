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
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    payment_intent_id: {
      type: String, // Stripe payment intent ID — populate once payment is processed
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

// Compound index to speed up overlap queries per property
BookingSchema.index({ property: 1, check_in: 1, check_out: 1 });

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;