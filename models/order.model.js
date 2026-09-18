const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    selectedSize: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    deliveryAddress: {
      type: addressSchema,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
