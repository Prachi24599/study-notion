import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new mongoose.Schema({
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
    const mailResponse = await mailSender(
        email,
        "Verification email from StudyNotion",
        otpTemplate(otp)
    );
    console.log("Email Send Successfully!", mailResponse);
}

//pre middleware to send email
otpSchema.post("save", async function () {
    await sendVerificationEmail(this.email, this.otp);
})

export default mongoose.model("Otp", otpSchema)