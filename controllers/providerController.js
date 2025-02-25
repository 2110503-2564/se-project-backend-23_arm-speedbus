const provider = require('../models/ProviderModel');

// @desc    Get all providers
// @route   GET /api/v1/providers
// @access  Public
exports.getProviders = async (req, res, next) => {
    try {
        const providers = await provider.find();
        res.status(200).json({ success: true, data: providers });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

// @desc    Get a single provider
// @route   GET /api/v1/providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
    try {
        const provider = await provider.findById(req.params.id);

        if(!provider){
            return res.status(400).json({success:false});
        }

        res.status(200).json({ success: true, data: provider });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}


// @desc    Create a provider
// @route   POST /api/v1/providers
// @access  admin
exports.createProvider = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(400).json({success:false, message:"Only admin can create a provider"});
        }

        const provider = await provider.create(req.body);

        res.status(201).json({ success: true, data: provider });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}


// @desc    Update a provider
// @route   PUT /api/v1/providers/:id
// @access  admin
exports.updateProvider = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(400).json({success:false, message:"Only admin can update a provider"});
        }

        const provider = await provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!provider) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: provider });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

// @desc    Delete a provider
// @route   DELETE /api/v1/providers/:id
// @access  admin
exports.deleteProvider = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(400).json({success:false, message:"Only admin can delete a provider"});
        }

        const provider = await provider.findByIdAndDelete(req.params.id);

        if (!provider) {
            return res.status(400).json({ success: false });
        }

        //delete all cars of this provider
        await car.deleteMany({provider_id: req.params.id});

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}