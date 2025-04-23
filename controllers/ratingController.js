const Rating = require("../models/RatingModel");
const Car = require("../models/CarModel");
const Rent = require("../models/RentModel");

// @desc     Get ratings for a car
// @route    GET /api/v1/ratings
// @access   Public
exports.getRatings = async (req, res) => {};

// @desc    POST rating for car
// @route   POST /api/v1/ratings
// @access  Public
exports.createRating = async (req, res, next) => {
  try {
    const { rent_info, car_rating, provider_rating, review } = req.body;

    // 1. ตรวจสอบ rent ว่ามีจริงไหม
    const rent = await Rent.findById(rent_info);
    if (!rent) {
      return res
        .status(404)
        .json({ success: false, message: "Rent not found" });
    }

    // 2. ตรวจสอบ car ที่เช่ามาว่ามีจริงไหม
    const car = await Car.findById(rent.car_info);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // ✅ 3. ตรวจสอบว่ามีการให้คะแนน rent นี้ไปแล้วหรือยัง
    const existingRating = await Rating.findOne({ rent_info: rent._id });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this rent.",
      });
    }

    // 4. สร้าง rating ใหม่
    const newRating = await Rating.create({
      rent_info,
      car_info: car._id,
      provider_info: car.provider_info,
      user_info: rent.user_info,
      car_rating,
      provider_rating,
      review,
    });

    // 5. ตอบกลับ
    res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (err) {
    console.error("Error in createRating:", err);
    res.status(500).json({ success: false, msg: "Cannot create rating" });
  }
};
