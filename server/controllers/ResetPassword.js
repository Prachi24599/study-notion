//User click on Forgot Password -> Link Generate -> Mail send -> (Open email and click on the link) 
// -> UI Open -> New Password Update
//To Verify the correct link, we will generate the token and set the expire time
//The Token will be valid for that particular time

//The above logic is divided into 2 Parts -
//1. Link Generate and Mail Send
//2. Open Link and Reset the Password

import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import crypto from "node:crypto";

//1. Link Generate and Mail Send
//resetPasswordToken
const resetPasswordToken = async (req, res) => {
   try{
        //Get email from req.body
        const email = req.body.email;
        //Email validation - Check user for this email
        const user = await User.findOne({email : email});
        if(!user){
            return res.status(500).json({
                success : false,
                message : "Your email is not registered."
            })
        }
        //Generate Token
        const token = crypto.randomUUID();
        //Update user by adding token and expiration date
        const updatedDetails = await User.findOneAndUpdate(
            {email : email},
            {
                token : token,
                resetPasswordExpires : Date.now() + 5 * 60 * 1000,
            },
            {new : true} //Fetch the updated document
        )
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //Send mail containing the url
        await mailSender(email, 
                        "Password Reset Link - Study Notion",
                        `Password Reset Link : ${url}`);
        //return response
        res.status(200).json({
            success : true,
            message : "Email sent successfully, please check."
        })
   }catch(err){
        console.log("Error while resetting pass token", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
   }
}

//2. Open Link and Reset the Password
