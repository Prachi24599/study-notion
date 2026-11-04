import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const optSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5 * 60 //after 5 min
    }
})

//function to send email
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otp);
        console.log("Email Send Successfully!", mailResponse);
    }catch(error){
        console.error("Error occoured while sending email", error);
    }
}

//pre middleware to send email
optSchema.post("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next(); //call next middleware
})

export default mongoose.model("Otp", optSchema)