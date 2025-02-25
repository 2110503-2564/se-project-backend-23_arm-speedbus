const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    vin_plate: { 
        type: String, 
        required: true, 
        unique: true 
    },
    provider_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    } 
    }, { 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

CarSchema.virtual('Provider', {
    ref: 'UserModel',
    localField: 'provider_id',
    foreignField: '_id',
    justOne: false
});



module.exports = mongoose.model('Car', CarSchema);