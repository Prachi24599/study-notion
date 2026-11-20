import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    courseName : {
        type : String,
    },
    courseDescription : {
        type : String
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    whatYouWillLearn : {
        type : String
    },
    tag: {
		type: [String],
		required: true,
	},
    courseContent : [{ //Section
        type : mongoose.Schema.Types.ObjectId,
        ref : "Section"
    }],
    ratingAndReviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingsAndReview"
    }],
    price : {
        type : Number,
    },
    thumbnail : {
        type : String
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    studentsEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    status : {
        type : "String",
        enum : ["Draft", "Published"]
    }
})

export default mongoose.model("Course", courseSchema);