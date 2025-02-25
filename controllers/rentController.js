const Rent = require('../models/Rent'); 
const Car = require('../models/Car'); 
const User = require('../models/User'); 

// @desc   Get all rents
// @route  GET /api/v1/rents
// @access Private
exports.getRents = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Rent.find({ user: req.user.id }).populate({
            path: 'car',
            select: 'car_id startDate endDate',
        });
    } else {
        query = Rent.find().populate({
            path: 'car',
            select: 'car_id startDate endDate',
        });
    }

    try {
        const rents = await query;

        res.status(200).json({
            success: true,
            count: rents.length,
            data: rents,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot find Rent' });
    }
};

// @desc   Add rent
// @route  POST /api/v1/cars/:carId/rents/
// @access Private
exports.addRent = async (req, res, next) => {
    try {
        req.body.car_id = req.params.carId;
        req.body.user_id = req.user.id;

        const car = await Car.findById(req.params.carId);

        if (!car) {
            return res.status(404).json({ success: false, message: `No car with the id of ${req.params.carId}` });
        }

        
        req.body.user = req.user.id;

        
        

        
        if (req.user.role === "user") {
            const existingRents = await Rent.countDocuments({ user_id: req.user.id });
            if (existingRents >= 3) {
                return res.status(400).json({ success: false, message: `User ${req.user.id} has already rented 3 cars` });
            }
        }

        const rent = await Rent.create(req.body);
        res.status(200).json({ success: true, data: rent });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot create Rent' });
    }
};