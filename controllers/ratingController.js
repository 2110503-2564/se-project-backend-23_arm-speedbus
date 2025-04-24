const Rating = require("../models/RatingModel");
const Car = require("../models/CarModel");
const Rent = require("../models/RentModel");
const Provider = require("../models/ProviderModel");

// @desc     Get all ratings
// @route    GET /api/v1/ratings/all
// @access   Private
exports.getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find()
      .populate("car_info", "name vin_plate")
      .populate("provider_info", "name")
      .populate("user_info", "name email");
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (err) {
    console.error("Error in getAllRatings:", err);
    res.status(500).json({ success: false, msg: "Cannot get ratings" });
  }
};

// @desc     Get ratings for a specific car
// @route    GET /api/v1/cars/:carId/ratings
// @access   Public
exports.getRatingsForCar = async (req, res, next) => {
  try {
    const { carId } = req.params;

    // Check if carId is valid
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Pull ratings for the car
    const ratings = await Rating.find({ car_info: car._id }).populate(
      "user_info",
      "name email"
    );

    // response
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (err) {
    console.error("Error in getRatings:", err);
    res.status(500).json({ success: false, msg: "Cannot get ratings" });
  }
};

// @desc    Get ratings for a specific provider
// @route   GET /api/v1/providers/:providerId/ratings
// @access  Public
exports.getRatingsForProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    // Check if providerId is valid
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    // Pull ratings for the provider
    const ratings = await Rating.find({ provider_info: provider._id }).populate(
      "user_info",
      "name email"
    );

    // response
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (err) {
    console.error("Error in getRatings:", err);
    res.status(500).json({ success: false, msg: "Cannot get ratings" });
  }
};

// @desc    Get ratings for the logged-in user
// @route   GET /api/v1/ratings/me
// @access  Private
exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("User ID:", userId);

    const ratings = await Rating.find({ user_info: userId })
      .populate("car_info", "name vin_plate")
      .populate("provider_info", "name");

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (err) {
    console.error("Error in getMyRatings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create a new rating
// @route   POST /api/v1/ratings
// @access  Private
exports.createRating = async (req, res, next) => {
  try {
    const { rent_info, car_rating, provider_rating, review } = req.body;

    // Check if rent_info is valid
    const rent = await Rent.findById(rent_info);
    if (!rent) {
      return res
        .status(404)
        .json({ success: false, message: "Rent not found" });
    }

    // Check end date must be in the past before rating
    const endDate = new Date(rent.endDate);
    const currentDate = new Date();
    if (endDate > currentDate) {
      return res.status(400).json({
        success: false,
        message: "You cannot rate a rent that is not yet completed.",
      });
    }

    // Check if car_info is valid
    const car = await Car.findById(rent.car_info);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Check if user has already rated this rent
    const existingRating = await Rating.findOne({ rent_info: rent._id });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this rent.",
      });
    }

    // Create a new rating
    const newRating = await Rating.create({
      rent_info,
      car_info: car._id,
      provider_info: car.provider_info,
      user_info: rent.user_info,
      car_rating,
      provider_rating,
      review,
    });

    // response
    res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (err) {
    console.error("Error in createRating:", err);
    res.status(500).json({ success: false, msg: "Cannot create rating" });
  }
};

// @desc    Update a rating
// @route   PUT /api/v1/ratings/:id
// @access  Private
exports.updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { car_rating, provider_rating, review } = req.body;

    // Check if rating exists
    const rating = await Rating.findById(id);
    if (!rating) {
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    // Update the rating
    rating.car_rating = car_rating || rating.car_rating;
    rating.provider_rating = provider_rating || rating.provider_rating;
    rating.review = review || rating.review;

    await rating.save();

    // response
    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (err) {
    console.error("Error in updateRating:", err);
    res.status(500).json({ success: false, msg: "Cannot update rating" });
  }
};

// @desc    Delete a rating
// @route   DELETE /api/v1/ratings/:id
// @access  Private
exports.deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if rating exists
    const rating = await Rating.findById(id);
    if (!rating) {
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    // Delete the rating
    await rating.deleteOne();

    // response
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("Error in deleteRating:", err);
    res.status(500).json({ success: false, msg: "Cannot delete rating" });
  }
};
