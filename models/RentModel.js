const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    car_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CarModel', 
        required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserModel', 
        required: true 
    },
    iDate: { 
        type: Date, 
        default: Date.now 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    } 
});

module.exports = mongoose.model('Rent', RentSchema);