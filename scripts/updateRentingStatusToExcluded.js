const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Rent = require("../models/RentModel");
require("dotenv").config({ path: "../config/config.env" });

async function updateRentingStatusToExcluded() {
  try {
    await connectDB();

    // อัปเดตทุก renting ให้เป็น 'Excluded'
    await Rent.updateMany(
      {}, // อัปเดตทุกเรคคอร์ด
      { $set: { InclusionForCalculation: "Excluded" } } // เปลี่ยนค่า InclusionForCalculation เป็น 'Excluded'
    );
    console.log("All renting records have been updated to Excluded");

    await mongoose.disconnect();
    console.log("MongoBD disconnected");
  } catch (error) {
    console.error("Error updating renting records:", error);
  }
}

updateRentingStatusToExcluded();
