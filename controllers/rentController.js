const Rent = require('../models/Rent'); 
const Car = require('../models/Car'); 
const User = require('../models/User'); 

// @desc   Get all rents
// @route  GET /api/v1/rents
// @access Private
exports.getRents = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Rent.find({ user_id: req.user.id }).populate({
            path: 'car_id',  
            select: 'name vin_plate'  
        });
    } else {
        query = Rent.find().populate({
            path: 'car_id',
            select: 'name vin_plate'
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

// @desc   Get single rent
// @route  GET /api/v1/rents/:id
// @access Private
exports.getRent = async (req, res, next) => {
    try {
        const rent = await Rent.findById(req.params.id).populate({
            path: 'car_id',
            select: 'name vin_plate'
        });

        if (!rent) {
            return res.status(404).json({ 
                success: false, 
                message: `No rent with the id of ${req.params.id}` 
            });
        }

       //Check if the user is owner or admin
        if (req.user.role !== 'admin' && rent.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this rent'
            });
        }

        res.status(200).json({
            success: true,
            data: rent
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            message: "Cannot find Rent" 
        });
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




