import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";

//auth
const auth = async (req, res, next) => {
    try{
        //Extract Token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");
        //If token missing
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing!"
            })
        }
        //Verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decode", decode);
            req.user = decode;
        }catch(err) {
            //verification issue
            return res.status(401).json({
                success : false,
                message : "Token is Invalid",
            })
        }
        next();
    }catch(err) {
        res.status(401).json({
            success : false,
            message : "Something went wrong while validating the token"
        })
    }
}

//isStudent
const isStudent = async () => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for student only"
            })
        }
        next();
    }catch(err){
        res.status(500).json({
             success : false,
            message : "User role cannot be verified, Please try again!"
        })
    }   
}

