const express = require("express");

const User = require("../models/user.model");
const Order = require("../models/order.model");
const authenticateUser = require("../middleware/auth.middleware");

const router = express.Router();

/*
  CREATE ORDER
*/
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { items, deliveryAddress, subtotal, shipping, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product.",
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required.",
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items,
      deliveryAddress,
      subtotal,
      shipping,
      total,
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        orders: order._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to place order.",
    });
  }
});

/*
  GET CURRENT USER ORDERS
*/
router.get("/", authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
});

module.exports = router;
