const express = require("express");
const {
  getALlRewards,
  getOneReward,
  getMyRewards,
  createReward,
  updateReward,
} = require("../controllers/rewardController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin"), getALlRewards)
  .post(protect, authorize("admin"), createReward);

router.route("/user").get(protect, getMyRewards);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOneReward)
  .put(protect, authorize("admin"), updateReward);

module.exports = router;
