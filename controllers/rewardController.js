const Coupon = require("../models/CouponModel");

// @desc    Get all rewards
// @route   GET /api/v1/rewards
// @access  Private
exports.getALlRewards = async (req, res, next) => {
  try {
    const rewards = await Coupon.find();
    res
      .status(200)
      .json({ success: true, count: rewards.length, data: rewards });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve rewards" });
  }
};

// @desc    Get one reward by ID
// @route   GET /api/v1/rewards/:id
// @access  Private
exports.getOneReward = async (req, res, next) => {
  try {
    const reward = await Coupon.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({ success: true, data: reward });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve reward" });
  }
};

// @desc    Get rewards for the current user
// @route   GET /api/v1/rewards/user
// @access  Private
exports.getMyRewards = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const rewards = await Coupon.find({ user_info: userId });

    res
      .status(200)
      .json({ success: true, count: rewards.length, data: rewards });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve user rewards" });
  }
};

// @desc    Create a reward
// @route   POST /api/v1/rewards
// @access  Private
exports.createReward = async (req, res, next) => {
  try {
    // Validate the request body
    const { user_info, percentage, requirement, expirationDate } = req.body;

    if (!user_info || !percentage || !requirement || !expirationDate) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: user_info, percentage, requirement, expirationDate",
      });
    }

    const reward = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: reward });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reward" });
  }
};

// @desc    Update a reward
// @route   PUT /api/v1/rewards/:id
// @access  Private
exports.updateReward = async (req, res, next) => {
  try {
    const reward = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward with the id ${req.params.id} does not exist`,
      });
    }
    res.status(200).json({ success: true, data: reward });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Reward" });
  }
};
