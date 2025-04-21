const mongoose = require('mongoose');
const Rating = require('../models/RatingModel');
const User = require('../models/UserModel');
const Provider = require('../models/ProviderModel');
const Car = require('../models/CarModel');

// @desc     Get ratings for a car
// @route    GET /api/v1/cars/:id/ratings
// @access   Public
exports.getRatings = async (req, res) => {
    try {
      // First check if there is a hotel.
      const car = await Car.findById(req.params.id);
      if (!car) {
        return res.status(404).json({
          success: false,
          msg: `No car found with ID ${req.params.id}`,
        });
      }
  
      let query;
  
      // Copy req.query
      const reqQuery = { ...req.query };
  
      // Fields to exclude from query
      const removeFields = ["select", "sort", "page", "limit"];
      removeFields.forEach((param) => delete reqQuery[param]);
  
      // Create query string and replace MongoDB operators
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\bgt|gte|lt|lte|in\b/g,
        (match) => `$${match}`
      );
  
      // Create base query (filter by hotelId)
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format, req.params.id is not Object ID in ratingController" });
      }
      query = Rating.find({ car_info: req.params.id, ...JSON.parse(queryStr) })
        .populate("user_info", "name")
        .sort("-createdAt");
  
      // Select specific fields
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      }
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      }
  
      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Rating.countDocuments({ hotel: req.params.hotelId });
  
      query = query.skip(startIndex).limit(limit);
  
      // Execute query
      const ratings = await query;
  
      // Calculate average rating using aggregation
      const result = await Rating.aggregate([
        { $match: { car_info: new mongoose.mongo.ObjectId(req.params.id) } },
        { $group: { _id: "$hotel", averageRating: { $avg: "$rating" } } },
      ]);
  
      const averageRating = result.length
        ? parseFloat(result[0].averageRating.toFixed(1))
        : 0;
  
      // Pagination result
      const pagination = {};
  
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }
  
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }
  
      res.status(200).json({
        success: true,
        count: ratings.length,
        averageRating,
        pagination,
        data: ratings,
      });
    } catch (err) {
      console.error("Error in getRatings:", err);
      res.status(500).json({ success: false, msg: "Cannot fetch ratings" });
    }
  };