const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    slices: [String],

    totalPrice: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
