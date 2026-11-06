import User from "../models/User.js";
import Otp from "../models/Otp.js";
import otpGenerator from "otp-generator";

//sendOtp
const sendOtp = async (req, res) => {
    try{
        //fetch email from req.body
        const {email} = req.body;

        //Check if user already exits
        const checkUserPresent = await User.findOne({email});

        //If user already exits, then return the response
        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message : "User already registered!"
            })
        }

        //generate otp
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        })

        console.log("Opt Generated", otp);

        //The generated opt must be unique
        //check unique otp or not
        //Checking in Db if the otp already exits
        var otpExits = await Otp.findOne({otp : otp});
        //otp already exits
        //Keep generating new otp until we get a unique otp
        while(otpExits){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false
            })
            otpExits = await Otp.findOne({otp : otp});
        }

        //ones we found a unique otp, add that entry in the db
        const otpPayload = {email, otp};
        const otpBody = await Otp.create({otpPayload});
        console.log("Otp added to db", otpBody);

        //return successful response
        res.status(200).json({
            success : true,
            data : otpBody,
            message : "Otp sent successfully!"
        })
    }catch(err){
        console.err("Error while generating otp", err);
        res.status(500).json({
            success : false,
            data : err,
            message : "Error while generating otp"
        })
    }
} 

//Signup

//Login