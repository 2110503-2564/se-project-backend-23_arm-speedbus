const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    car_info: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    user_info: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    iDate: { 
        type: Date,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date in yyyy-mm-dd format'],
        default: Date.now 
    },
    startDate: { 
        type: Date,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date in yyyy-mm-dd format'],
        required: true 
    },
    endDate: { 
        type: Date,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date in yyyy-mm-dd format'],
        required: true 
    } 
});

module.exports = mongoose.model('Rent', RentSchema);