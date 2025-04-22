const express = require("express");
const {
  getRatings,
  createRating
} = require("../controllers/ratingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getRatings)
    .post(createRating);

module.exports = router;
