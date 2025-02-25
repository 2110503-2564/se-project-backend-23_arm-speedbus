const exp = require('constants');
const car = require('../models/CarModel');

// @desc    Get all cars
// @route   GET /api/v1/cars
// @access  Public
exports.getCars = async (req, res, next) => {
    try {
        let query;
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = car.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        const cars = await query;
        res.status(200).json({ success: true, data: cars });
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
}

// @desc    Get a single car
// @route   GET /api/v1/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
    try {
        const car = await car.findById(req.params.id);
        if(!car){
            return res.status(400).json({success:false});
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

// @desc    Create a car
// @route   POST /api/v1/cars
// @access  Provider
exports.createCar = async (req, res, next) => {
    try {
        const car = await car.create(req.body);
        res.status(201).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}


// @desc    Update a car
// @route   PUT /api/v1/cars/:id
// @access  Provider
exports.updateCar = async (req, res, next) => {
    try {
        const car = await car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!car) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

// @desc    Delete a car
// @route   DELETE /api/v1/cars/:id
// @access  Provider
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await car.findById(req.params.id);
        if (!car) {
            return res.status(400).json({ success: false, message: 'Car not found' });
        }
        await car.removeOne({ _id: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}