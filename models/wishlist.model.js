const express = require("express");

const User = require("../models/user.model");
const Product = require("../models/product.models");
const authenticateUser = require("../middleware/auth.middleware");

const router = express.Router();

/*
  GET USER WISHLIST
*/
router.get("/", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("wishlist")
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load wishlist.",
    });
  }
});

/*
  ADD PRODUCT TO WISHLIST
*/
router.post("/:productId", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId,
    );

    if (!alreadyExists) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist.",
    });
  }
});

/*
  REMOVE PRODUCT FROM WISHLIST
*/
router.delete("/:productId", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist.",
    });
  }
});

module.exports = router;
