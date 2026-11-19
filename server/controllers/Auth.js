import User from "../models/User.js";
import Otp from "../models/Otp.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailSender from "../utils/mailSender.js";
import { passwordUpdated } from "../mail/templates/passwordUpdate.js";
dotenv.config();

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
        let otp = otpGenerator.generate(6, {
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
            message : err.message
        })
    }
} 

//Signup
const signUp = async (req, res) => {
    try{
        //fetch data from req.body
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;  
        //Validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp){
            return res.status(403).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //Match 2 passowords
        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Password and confirm password value does not match!"
            })
        }

        //Check if user already exits or not?
        const isUserExits = await User.findOne({email});
        if(isUserExits){
            return res.status(400).json({
                success : false,
                message : "User is already registered!"
            })
        }
         
        //Find the most recent otp stored for the user
        const recentOtp = await Otp.find({email}).sort({createdAt : -1}).limit(1);
        console.log("recentOtp", recentOtp);

        //Validate otp
        if(recentOtp === 0) {
            //otp not found
             return res.status(400).json({
                success : false,
                message : "Otp not found!"
            })
        } else if(otp !== recentOtp.otp){
            //Invalid otp - otp does not match
             return res.status(400).json({
                success : false,
                message : "Invalid Otp!"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Create entry in DB

        const profileDetails = await Profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null
        })

        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            contactNumber, 
            password : hashedPassword, 
            accountType,
            additionalDetails : profileDetails._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res
        res.status(200).json({
            success : true,
            data : user,
            message : "User created Successfully!!"
        })
    }catch(err) {
        console.err("Error while Signup!", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

//Login
const login = async (req, res) => {
    try{
        //get data from req.body
        const {email, password} = req.body;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "All fields are required, please try again!"
            })
        }
        //check if user exits or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User is not registered, Please sign up first!"
            })
        }
        //match password
        if(await bcrypt.compare(password, user?.password)){
            //generate jwt token
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn : "2h"
            })
            user.token = token;
            user.password = undefined

            //create cookie and send response
            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }
            res.cookie("token", token, options).status(200).json({
                success : true,
                token,
                user,
                message : "Logged in Successfully!"
            })
        }else {
            return res.status(401).json({
                success : false,
                message : "Password is incorrect!"
            })
        } 
    }catch(err){
        console.err("Error while Login!", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

//Change Password
const changePassword = async (req, res) => {
    try{
        //fetch data from req body - oldPassword, newPassword, confirmNewPassword
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const id = req.user.id;
         //validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(500).json({
                success : "false",
                message : "All the fields are required."
            })
        }
        //fetch user details
        const userDetails = await User.findById(id);
        //validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)
        //If old password does not match, return a 401 (Unauthorized) error
        if(!isPasswordMatch){
            return res.status(401).json({
                success : false,
                message : "The old password is incorrect!"
            })
        }
        //Match the newPassword and confirmNewPassword
        if(newPassword !== confirmNewPassword){
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success : false,
                message : "The password and confirm password does not match"
            })
        }
        //Encrypt new password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        //update new password in db
        const updatedUserDetails = await User.findByIdAndUpdate(
            id,
            {password : encryptedPassword},
            {new : true}
        )
        //send notification mail for - Password Reset
        try{
            const emailResponse = await mailSender(
                                        updatedUserDetails.email,
                                        "Password Update Confirmation",
                                        passwordUpdated(
                                            updatedUserDetails.email,
                                            `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                                        )
                                 )
            console.log("Email sent successfully", emailResponse);
        }catch(err){
           // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

       	// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
    }catch(err) {
        console.err("Error while Login!", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {sendOtp, signUp, login, changePassword}