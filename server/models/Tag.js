import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }
})

export default mongoose.model("Tag", tagSchema);