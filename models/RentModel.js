const mongoose = require("mongoose");

const RentSchema = new mongoose.Schema(
  {
    car_info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user_info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //rent date will be YYYY-MM-DD format, time will default in 00:00:00
    iDate: {
      type: Date,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Please provide a valid date in yyyy-mm-dd format",
      ],
      default: Date.now,
    },
    startDate: {
      type: Date,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Please provide a valid date in yyyy-mm-dd format",
      ],
      required: true,
    },
    endDate: {
      type: Date,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Please provide a valid date in yyyy-mm-dd format",
      ],
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Finished"],
      default: "Confirmed",
    },
    inclusionForCalculation: {
      type: String,
      enum: ["Included", "Excluded"],
      default: "Included",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Rent", RentSchema);
