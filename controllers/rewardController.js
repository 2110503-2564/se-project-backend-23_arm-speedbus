// @desc    Get all rewards
// @route   GET /api/v1/rewards
// @access  Private
exports.getRewards() = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin'){
        // if request role is not admin
        /*query = */
    }
    else {
        // if request role is admin
        /*query = */
    }

    try {
        const rents = await query;
        res.status(200).json({success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot find Reward'});
    }
}

// @desc    Get one reward
// @route   GET /api/v1/reward/:id
// @access  Private
exports.getRewards() = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin'){
        // if request role is not admin
        /*query = */
    }
    else {
        // if request role is admin
        /*query = */
    }

    try {
        const rents = await query;
        res.status(200).json({success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot find Reward'});
    }
}