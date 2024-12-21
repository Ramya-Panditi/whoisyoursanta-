const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser")
const cors = require("cors")
require('dotenv').config();
const route = require("./routes");

mongoose.set("strictQuery",true);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fwqq3.mongodb.net/`)
const db = mongoose.connection;
db.on('open', ()=> console.log("DB CONNECTED EHHE"));
db.on('error',()=> console.log("ERROR"));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}));

const corsOptions = {
    origin: ['http://localhost:3000','https://whoisyoursanta-epdw.vercel.app/'],  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));  
app.use("/",route);

app.listen(4000,()=>{
    console.log("HEY IN SERVER")
})

