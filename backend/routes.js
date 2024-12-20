const express = require("express");
const schema = require("./schema");
const mongoose = require("mongoose");
const emailHandler = require("express-async-handler");
const nodemailer = require("nodemailer")
const weblink = "http://localhost:3000/"


const route = express.Router();

route.post("/add", async (req, res) => {
    try {
        const { roomcode, group } = req.body;

        const existingRoom = await schema.findOne({ roomcode });

        const upundrawn = group.map((mem) => mem.name);

        if (existingRoom) {
          
            await schema.updateOne(
                { roomcode },
                {
                    $set: { group }, 
                    $addToSet: { undrawn: { $each: upundrawn } }, 
                }
            );
            return res.status(200).json({ message: "Room updated successfully" });
        }

        const newRoom = await schema.create({
            roomcode,
            group,
            undrawn: upundrawn,
        });

        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

route.post("/add-draws", async (req, res) => {
    try {
        const { roomcode, draws, undrawn } = req.body;  
        console.log(draws) 
        console.log("uabove is draw");
        console.log(undrawn);      
        const room = await schema.findOne({ roomcode });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (!draws || typeof draws !== "object") {
            return res.status(400).json({ message: "Invalid draws format" });
        }

       const response   =  await schema.updateOne(
            { roomcode },
            { $set: {draws,undrawn} }
          
        );

        return res.send(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})


route.post("/sendEmail",async (req,res)=>{
    const {roomcode,group} = req.body;
    console.log(group);
   
    // console.log(emails);
    
    group.map((mem) => {
        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: mem.email,
            subject: "YOU GOT AN INVITATION TO PLAY SECRET SANTA",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #ff6347;">Hey ${mem.name}!</h2>
                <p>You have been invited to play <strong>WHO IS YOUR SANTA</strong>. Exciting, right?</p>
                <p>A room has been created for your lovely group. All you have to do is:</p>
                <ol>
                    <li>Enter the room code: <strong style="color: #007bff;">${roomcode}</strong></li>
                    <li><a href=${weblink} style="color: #007bff; text-decoration: none;">Click here to open our website</a></li>
                    <li>Draw the names and start exchanging gifts!</li>
                </ol>
                <p>Have fun and happy gifting! 🎁</p>
                <p style="color: #555;">Cheers,</p>
                <p><em>Whoisyoursanta team</em></p>
            </div>`
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
            } else {
                console.log(info);
                return res.status(200).json({ success: true, message: 'Email sent successfully', info: info });
            }
        });
    });
    
    
    


})
route.post("/sendMessage", async (req, res) => {
    const { email, subject, message } = req.body;

    var mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
        } else {
            console.log("SENT");
            return res.status(200).json({ success: true, message: 'Email sent successfully', info: info });
        }
    });
});
route.post("/update-undrawn", async (req, res) => {
    try {
        const { roomcode, undrawn } = req.body;
        const room = await schema.findOne({ roomcode });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const response = await schema.updateOne(
            { roomcode },
            { $set: { undrawn } }
        );

        return res.status(200).json({ message: "Undrawn members updated successfully", response });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});







route.get("/check/:roomcode",async (req,res)=>{
    const code = req.params.roomcode;
    console.log(req.body);
    try{
        const data = await schema.findOne({roomcode:code});
        if(data){
            console.log(data);
            res.json(data);
        }else{
            res.status(404).json({message:"room not found"});
        }

    }
    catch(error){
        res.status(500).json({error:error.message});
    }
    
})


module.exports = route;
