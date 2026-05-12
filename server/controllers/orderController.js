const Order = require("../models/Order");
const calculatePrice = require("../utils/priceCalculator");

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      address,
      paymentMethod,
      quantity,
      slices,
    } = req.body;
 if (
      !customerName ||
      !mobileNumber ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const totalPrice = calculatePrice(
      slices,
      quantity
    );
     const order = await Order.create({
      customerName,
      mobileNumber,
      address,
      paymentMethod,
      quantity,
      slices,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};