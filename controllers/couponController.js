const Coupon = require("../models/CouponModel");

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({
      expirationDate: 1,
      percentage: -1,
    });
    res
      .status(200)
      .json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve coupons" });
  }
};

// @desc    Get one coupon by ID
// @route   GET /api/v1/coupons/:id
// @access  Private
exports.getOneCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve coupon" });
  }
};

// @desc    Get coupons for the current user
// @route   GET /api/v1/coupons/user
// @access  Private
exports.getMyCoupons = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const coupons = await Coupon.find({ user_info: userId }).sort({
      expirationDate: 1,
      percentage: -1,
    });

    res
      .status(200)
      .json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve user coupons" });
  }
};

// @desc    Create a coupon
// @route   POST /api/v1/coupons
// @access  Private
exports.createCoupon = async (req, res, next) => {
  try {
    // Validate the request body
    const { percentage, requirement, expirationDate } = req.body;

    if (!percentage || !requirement || !expirationDate) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: percentage, requirement, expirationDate",
      });
    }

    const coupon = await Coupon.create({
      user_info: req.user._id,
      percentage,
      requirement,
      expirationDate,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create coupon" });
  }
};

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon with the id ${req.params.id} does not exist`,
      });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update coupon" });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon with the id ${req.params.id} does not exist`,
      });
    }
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
      message: `Coupon with the id of ${req.params.id} has been deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete coupon" });
  }
};
