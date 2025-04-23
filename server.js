const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 1000,
});

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

const carRoute = require("./routes/carRoute");
const authRoute = require("./routes/authRoute");
const rentRoute = require("./routes/rentRoute");
const providerRoute = require("./routes/providerRoute");
const auditLogRoute = require("./routes/auditLogRoute");
const couponRoute = require("./routes/couponRoute");
const couponTemplateRoute = require("./routes/couponTemplateRoute");
const ratingRoute = require("./routes/ratingRoute");

app.use("/api/v1/auditlogs", auditLogRoute);
app.use("/api/v1/providers", providerRoute);
app.use("/api/v1/cars", carRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/rents", rentRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/coupon-templates", couponTemplateRoute);
app.use("/api/v1/ratings", ratingRoute);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on ${process.env.HOST}:${PORT}`
  )
);

//handle unhandeled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
