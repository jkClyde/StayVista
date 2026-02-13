import { Schema, model, models } from 'mongoose';

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: ['entire_place', 'private_room', 'bedspace'],
      required: true,
    },

    location: {
      area: {
        type: String,
        enum: [
          'Baguio City',
          'La Trinidad',
          'Itogon',
          'Sablan',
          'Tuba',
          'Tublay',
        ],
        required: true,
      },
      street: String,
      landmark: String,
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    beds: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    basePricePerNight: {
      type: Number,
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    houseRules: {
      type: String,
    },

    checkInTime: {
      type: String,
      default: '14:00',
    },

    checkOutTime: {
      type: String,
      default: '12:00',
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property = models.Property || model('Property', PropertySchema);
export default Property;
