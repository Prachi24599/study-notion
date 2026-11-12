import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    //one category -> multiple courses
    //one category can belong to multiple courses
    course : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }]
})

export default mongoose.model("Category", categorySchema);