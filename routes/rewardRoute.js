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
  .get(getAllRewards)
  .post(protect, authorize("admin", "user"), createReward);

router.route("/user").get(protect, getMyRewards);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOneReward)
  .put(protect, authorize("admin", "user"), updateReward)
  .delete(protect, authorize("admin", "user"), deleteReward);

module.exports = router;
