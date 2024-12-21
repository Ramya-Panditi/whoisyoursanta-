const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const route = require("./routes");

mongoose.set("strictQuery", true);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fwqq3.mongodb.net/`);
const db = mongoose.connection;
db.on('open', () => console.log("DB CONNECTED EHHE"));
db.on('error', () => console.log("ERROR"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// CORS Options
const corsOptions = {
    origin: ['https://whoisyoursanta-frontend.onrender.com'],  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,  // Ensure 'Access-Control-Allow-Credentials' is included
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use the `cors` package
app.use(cors(corsOptions));

// Custom Middleware to Set Additional Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://whoisyoursanta-frontend.onrender.com'); // Allow specific origin
    res.header('Access-Control-Allow-Credentials', 'true'); // Ensure credentials are allowed
    next();
});

app.use("/", route);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`HEY IN SERVER on port ${PORT}`);
});
