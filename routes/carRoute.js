const express = require("express");
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { protect, authorize } = require("../middleware/auth");

const rentRouter = require("./rentRoute");

const router = express.Router();

router.use("/:carId/rents", rentRouter);

router.route("/").get(getCars).post(protect, authorize("admin"), createCar);
router
  .route("/:id")
  .get(getCar)
  .put(protect, authorize("admin"), updateCar)
  .delete(protect, authorize("admin"), deleteCar);
module.exports = router;
