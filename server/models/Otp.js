import mongoose from "mongoose";

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

 export default mongoose.model("Otp", optSchema)