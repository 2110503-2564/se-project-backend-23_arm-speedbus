const express = require("express");
const {
  getAllCouponTemplates,
  createCouponTemplate,
  updateCouponTemplate,
  deleteCouponTemplate,
} = require("../controllers/couponTemplateController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllCouponTemplates)
  .post(protect, authorize("admin"), createCouponTemplate);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateCouponTemplate)
  .delete(protect, authorize("admin"), deleteCouponTemplate);

module.exports = router;
