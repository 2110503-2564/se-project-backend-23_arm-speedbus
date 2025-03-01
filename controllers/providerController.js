const Provider = require('../models/ProviderModel');
const Car = require('../models/CarModel');
const AuditLog = require('../models/AuditLogModel');

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
        //Check if provided email address already exists
        const existedProvider = await Provider.findOne({email});
        if(existedProvider){
            return res.status(400).json({success:false,message:`Cannot add! The email ${req.body.email} for this provider is already registered`});
        }        
        //check if open time is earlier than close time
        if(openTime > closeTime){
            return res.status(400).json({success:false,message:'Open time must be earlier than close time'});
        }
        const provider = await Provider.create(req.body);
        await AuditLog.create({
            action:'Create',
            user_id:req.user._id,
            target:'providers',
            target_id:provider._id,
            description:`Created provider id ${provider._id}.`
        });
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
        //Check for duplicate email if email is provided
        if(email){
            const existedProvider = await Provider.findOne({email, _id: {$ne:req.params.id}});
            if (existedProvider) {
                return res.status(400).json({
                    success: false,message: `Cannot update! The email ${email} is already registered`,
                });
            }
        }

        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!provider) {
            return res.status(404).json({success: false,message:`Provider with the id ${req.params.id} does not exist`});
        }
        await AuditLog.create({
            action:'Update',
            user_id:req.user._id,
            target:'providers',
            target_id:provider._id,
            description:`Updated provider id ${provider._id}.`
        });
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
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({success: false, message:`Provider with the id ${req.params.id} does not exist`});
        }
        //delete all cars of this provider
        await Car.deleteMany({provider_id: req.params.id});
        const providerId = req.params.id;
        await Provider.findByIdAndDelete(req.params.id);
        await AuditLog.create({
            action:'Delete',
            user_id:req.user._id,
            target:'providers',
            target_id:providerId,
            description:`deleted provider id ${providerId}.`
        });
        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status(400).json({success: false,message:'Cannot delete a provider'});
    }
}