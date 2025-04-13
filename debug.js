const mongoose = require('mongoose');
const Rent = require('./models/RentModel');
const Car = require('./models/CarModel')
const connectDB = require('./config/db');
require('dotenv').config({path: './config/config.env'});

function getTotalDays(start, end) {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return (diffMs / (1000 * 60 * 60 * 24)) + 1;
}

async function initiateTotalDaysAndPrice() {
  try {
    await connectDB();
    const rents = await Rent.find().populate({path: 'car_info', select: 'name vin_plate pricePerDay'});
    console.log(`Found ${rents.length} rent records`);

    for (const rent of rents) {
      if (rent.startDate && rent.endDate && rent.car_info?.pricePerDay) {
        rent.totalDays = getTotalDays(rent.startDate, rent.endDate);
        rent.totalPrice = rent.totalDays * rent.car_info.pricePerDay;
        await rent.save();
        console.log(`Updated rent ${rent._id}: ${rent.totalDays} days, $${rent.totalPrice}`);
      } else {
        console.log(`Skipped rent ${rent._id} due to missing data`);
      }
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error during update:', err);
    process.exit(1);
  }
}

initiateTotalDaysAndPrice();