const Coupon = require("../models/CouponModel");

// @desc    Get all rewards
// @route   GET /api/v1/rewards
// @access  Private
// exports.getRewards() = async (req, res, next) => {
//     let query;
//     if (req.user.role !== 'admin'){
//         // if request role is not admin
//         /*query = */
//     }
//     else {
//         // if request role is admin
//         /*query = */
//     }

//     try {
//         const rents = await query;
//         res.status(200).json({success:true});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:'Cannot find Rewards'});
//     }
// }

// @desc    Get one reward
// @route   GET /api/v1/reward/:id
// @access  Private
// exports.getReward() = async (req, res, next) => {
//     let query;
//     if (req.user.role !== 'admin'){
//         // if request role is not admin
//         /*query = */
//     }
//     else {
//         // if request role is admin
//         /*query = */
//     }

//     try {
//         const rents = await query;
//         res.status(200).json({success:true});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:'Cannot find Reward'});
//     }
// }

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
