const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    user_info: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    percentage: {
        type: Number,
        required: true
    },
    // date will be YYYY-MM-DD format, time will default in 00:00:00
    requirement: { 
        type: String,
        required: true 
    },
    expirationDate: { 
        type: Date,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date in yyyy-mm-dd format'],
        default: Date.now 
    },
    status: {
        type: String,
        enum: ['Available','Used','Expired'],
        default: 'Available'
    }
},
    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('Coupon', CouponSchema);