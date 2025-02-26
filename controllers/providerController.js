const Provider = require('../models/ProviderModel');
const Car = require('../models/CarModel');

// @desc    Get all providers
// @route   GET /api/v1/providers
// @access  Public
exports.getProviders = async (req, res, next) => {
    try {
        const providers = await Provider.find();
        res.status(200).json({success: true, data: providers});
    } catch (err) {
        res.status(400).json({success: false, message:'Cannot get providers'});
    }
}

// @desc    Get a single provider
// @route   GET /api/v1/providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
    try {
        const provider = await Provider.findById(req.params.id);

        if(!provider){
            return res.status(404).json({success:false, message:`Provider with the id ${req.params.id} does not exist`});
        }

        res.status(200).json({ success: true, data: provider });
    } catch (err) {
        res.status(400).json({success: false, message:'Cannot get a provider'});
    }
}


// @desc    Create a provider
// @route   POST /api/v1/providers
// @access  admin
exports.createProvider = async (req, res, next) => {
    try {
        const {name, address, tel, email, openTime, closeTime} = req.body;

        //Check if duplicate email address exists
        const existedProvider = await Provider.findOne({email});
        if(existedProvider){
            return res.status(400).json({success:false,message:'Cannot add! The email for this provider is already registered'});
        }
        const provider = await Provider.create(req.body);
        
        res.status(201).json({success:true, data:provider});
    } catch (err) {
        // console.log(err);
        res.status(400).json({success:false, message:'Cannot add a provider'});
    }
}


// @desc    Update a provider
// @route   PUT /api/v1/providers/:id
// @access  admin
exports.updateProvider = async (req, res, next) => {
    try {
        const {name, address, tel, email, openTime, closeTime} = req.body;
        //Check if duplicate email address exists
        const existedProvider = await Provider.findOne({email});
        if(existedProvider){
            return res.status(400).json({success:false,message:'Cannot update! This email for this provider is already registered'});
        }

        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!provider) {
            return res.status(404).json({success: false,message:`Provider with the id ${req.params.id} does not exist`});
        }

        res.status(200).json({success:true, data:provider});
    } catch (err) {
        res.status(400).json({success:false,message:'Cannot update a provider'});
    }
}

// @desc    Delete a provider
// @route   DELETE /api/v1/providers/:id
// @access  admin
exports.deleteProvider = async (req, res, next) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);

        if (!provider) {
            return res.status(404).json({success: false, message:`Provider with the id ${req.params.id} does not exist`});
        }

        //delete all cars of this provider
        await Car.deleteMany({provider_id: req.params.id});

        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status(400).json({success: false,message:'Cannot delete a provider'});
    }
}