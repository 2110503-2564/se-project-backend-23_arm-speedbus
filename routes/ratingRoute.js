const express = require("express");
const {
  getAllRatings,
  getRatingsForCar,
  getRatingsForProvider,
  getMyRatings,
  createRating,
  updateRating,
  deleteRating,
} = require("../controllers/ratingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get((req, res, next) => {
    if (req.params.carId) return getRatingsForCar(req, res, next);
    if (req.params.providerId) return getRatingsForProvider(req, res, next);
  })
  .post(protect, authorize("user", "admin"), createRating);

router.route("/all").get(protect, authorize("admin"), getAllRatings);

router
  .route("/:id")
  .put(protect, authorize("user", "admin"), updateRating)
  .delete(protect, authorize("user", "admin"), deleteRating);

router.route("/me").get(protect, authorize("user", "admin"), getMyRatings);

module.exports = router;
