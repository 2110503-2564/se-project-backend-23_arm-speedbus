const mongoose = require('mongoose');
const Rent = require('./models/RentModel');
const User = require('./models/UserModel');
const Car = require('./models/CarModel')
const connectDB = require('./config/db');
require('dotenv').config({path: './config/config.env'});

function getTotalDays(start, end) {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return diffMs / (1000 * 60 * 60 * 24) + 1;
}

async function initiateTotalDaysAndPrice() {
  try {
    await connectDB();
    const rents = await Rent.find().populate({
      path: "car_info",
      select: "name vin_plate pricePerDay",
    });
    console.log(`Found ${rents.length} rent records`);

    for (const rent of rents) {
      if (rent.startDate && rent.endDate && rent.car_info?.pricePerDay) {
        rent.totalDays = getTotalDays(rent.startDate, rent.endDate);
        rent.totalPrice = rent.totalDays * rent.car_info.pricePerDay;
        await rent.save();
        console.log(
          `Updated rent ${rent._id}: ${rent.totalDays} days, $${rent.totalPrice}`
        );
      } else {
        console.log(`Skipped rent ${rent._id} due to missing data`);
      }
    }

    await mongoose.disconnect();
    console.log("MongoBD disconnected");
  } catch (err) {
    console.error("Error during update:", err);
    process.exit(1);
  }
}

async function initiateTotalPaymentForAllUsers() {
  try {
    await connectDB();
    const rents = await Rent.find().populate({path: 'car_info', select: 'name vin_plate pricePerDay'});
    const users = await User.find();
    console.log(`Found ${rents.length} rent records`);
    console.log(`Found ${users.length} user records`);

    for (const user of users) {
      let sum = 0;
      for (const rent of rents){
        if (rent.totalPrice && rent.user_info) {
          // console.log(rent.user_info + " " + user._id)
          if (rent.user_info.equals(user._id)){
            sum += rent.totalPrice;
            console.log(`User ${user._id} - adding $${rent.totalPrice}, total now ${sum}`);
          }
          // console.log("loop " + sum)
        }
        else {
          console.log(`Skipped rent ${rent._id} due to missing data`);
        }
      }
      await User.updateOne({ _id: user._id }, { totalPayment: sum });
      console.log(`Updated user ${user._id}: $${sum}`);
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error during update:', err);
    process.exit(1);
  }
}

// initiateTotalDaysAndPrice();
initiateTotalPaymentForAllUsers()