const express = require("express");
const {
  getRatingsForCar,
  getRatingsForProvider,
  createRating,
} = require("../controllers/ratingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get((req, res, next) => {
    if (req.params.carId) return getRatingsForCar(req, res, next);
    if (req.params.providerId) return getRatingsForProvider(req, res, next);
    res.status(400).json({ success: false, message: "Invalid route" });
  })
  .post(protect, authorize("user", "admin"), createRating);

module.exports = router;
