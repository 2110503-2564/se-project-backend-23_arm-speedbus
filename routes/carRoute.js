const express = require('express');
const { getCars, getCar, createCar, updateCar, deleteCar} = require('../controllers/carController');
const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getCars).post(protect, authorize('provider'), createCar);
router.route('/:id').get(getCar).put(protect, authorize('provider'), updateCar).delete(protect, authorize('provider'), deleteCar);