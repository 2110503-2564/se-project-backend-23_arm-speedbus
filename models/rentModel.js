const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    car_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    iDate: { 
        type: Date, 
        default: Date.now 
    }, 
    startDate: { 
        type: Date, 
        required: true 
        //fuctional
       /* ,validate: {
            validator: function(value) {
                return value >= new Date(); 
            },
            message: 'Start date cannot be in the past'
        }*/
    }, 
    endDate: { 
        type: Date, 
        required: true 
        //funtional
        /*,validate: {
            validator: function(value) {
                return this.startDate ? value > this.startDate : false;
            },
            message: 'End date must be after start date'
        }*/
    } 
});

module.exports = mongoose.model('Rent', RentSchema);