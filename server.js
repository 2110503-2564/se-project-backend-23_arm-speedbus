const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

const carRoute = require('./routes/carRoute');
const authRoute = require('./routes/authRoute');
const rentRoute = require('./routes/rentRoute');

app.use('/api/v1/hospitals', carRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/rents',rentRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));
});