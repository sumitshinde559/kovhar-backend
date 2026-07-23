const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: Number,
      required: true,
      min: 4,
      max: 12,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "KOVHAR",
      trim: true,
    },

    category: [
      {
        type: String,
        enum: ["Men", "Women", "Boy", "Girl", "Limited Edition"],
      },
    ],

    subCategory: {
      type: String,
      default: "Traditional",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    material: {
      type: String,
      default: "Genuine Leather",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    sizes: [sizeSchema],

    images: {
      type: [String],
      required: true,
      default: ["/images/products/default.jpg"],
    },

    reviews: [reviewSchema],

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    handcrafted: {
      type: Boolean,
      default: true,
    },

    isLimitedEdition: {
      type: Boolean,
      default: false,
    },

    limitedEditionCollab: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    deliveryInfo: {
      freeDelivery: {
        type: Boolean,
        default: true,
      },

      estimatedDays: {
        type: Number,
        default: 5,
      },

      returnable: {
        type: Boolean,
        default: true,
      },

      returnDays: {
        type: Number,
        default: 10,
      },
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
