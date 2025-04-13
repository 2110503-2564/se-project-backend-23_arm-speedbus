const express = require("express");
const {
  getRewards,
  getReward,
  createReward,
  updateReward,
} = require("../controllers/rewardController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  //   .get(protect, authorize("admin"), getRewards)
  .post(protect, authorize("admin"), createReward);

router
  .route("/:id")
  //   .get(protect, authorize("admin", "user"), getReward)
  .put(protect, authorize("admin"), updateReward);

module.exports = router;
