const express = require("express");
const {
  getRatings,
} = require("../controllers/ratingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getRatings);

module.exports = router;
