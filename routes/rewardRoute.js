const express = require("express");
const {
  getAllRewards,
  getOneReward,
  getMyRewards,
  createReward,
  updateReward,
  deleteReward,
} = require("../controllers/rewardController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin"), getAllRewards)
  .post(protect, authorize("admin"), createReward);

router.route("/user").get(protect, getMyRewards);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOneReward)
  .put(protect, authorize("admin"), updateReward)
  .delete(protect, authorize("admin"), deleteReward);

module.exports = router;
