const mongoose = require('mongoose');
const Rating = require('../models/RatingModel');
const User = require('../models/UserModel');
const Provider = require('../models/ProviderModel');
const Car = require('../models/CarModel');
const Rent = require('../models/RentModel')

// @desc     Get ratings for a car
// @route    GET /api/v1/cars/:id/ratings
// @access   Public
exports.getRatings = async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      if (!car) {
        return res.status(404).json({ success : false, msg : 'No car id exist'})
      }

      const ratings = await Rating.find({ car_info : req.params.id }).sort("-createdAt");
      if (!ratings) {
        return res.status(404).json({
          success: false,
          msg: `No car found with ID ${req.params.id}`,
        });
      }
      
      res.status(200).json({ success : true, count: ratings.length, data: ratings });
    } catch (err) {
      console.error("Error in getRatings:", err);
      res.status(500).json({ success: false, msg: "Cannot fetch ratings" });
    }
  };

// @desc    POST rating for car
// route    POST /api/v1/cars/:id/ratings
exports.createRating = async (req, res, next) => {
  try {
      const carId = req.params.id;
      if (!carId) {
        return res.status(404).json({ success : false, msg : "Cannot find the car."});
      }

      const rent = Rent.findOne({ user_info : req.user._id });
      if (rent) {
        return res.status(400).json({ success : false, msg: "You can rate only after you renting the car."});
      }

      const existRating = await Rating.find({ user_info : req.user._id });
      if (existRating) {
        return res.status(400).json({ success : false, msg: "You have already rate, You must update instead."});
      }

      const rating = await Rating.create(req.body);

      res.status(200).json({ success : true, data : rating});
  } catch (err) {
    res.status(500).json({ success : false, msg: err});
  }
};