const express = require("express");
const {
  getAllCoupons,
  getOneCoupon,
  getMyCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin"), getAllCoupons)
  .post(protect, authorize("admin", "user"), createCoupon);

router.route("/user").get(protect, getMyCoupons);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOneCoupon)
  .put(protect, authorize("admin", "user"), updateCoupon)
  .delete(protect, authorize("admin", "user"), deleteCoupon);

module.exports = router;
