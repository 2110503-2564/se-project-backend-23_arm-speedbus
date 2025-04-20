const express = require("express");
const {
  getRents,
  getRent,
  createRent,
  updateRent,
  deleteRent,
  finishRent,
} = require("../controllers/rentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getRents)
  .post(protect, authorize("admin", "user"), createRent);

router
  .route("/:id")
  .get(protect, getRent)
  .put(protect, authorize("admin", "user"), updateRent)
  .delete(protect, authorize("admin", "user"), deleteRent);

router.route("/finish/:id").put(protect, authorize("admin"), finishRent);

module.exports = router;
