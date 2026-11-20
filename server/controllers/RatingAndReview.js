import RatingsAndReview from "../models/RatingAndReview.js";
import Course from "../models/Course.js";

//createRatingandReview
const createRatingandReview = async (req, res) => {
    try{
        //get user id
        const userId = req.user.id;
        //fetchData from req.body
        const {courseId, rating, review} = req.body;
        //check if user is enrolled or not?
        const courseDetails = await Course.findOne(
            {_id : courseId,
            studentsEnrolled : {$eleMatch : {$eq : userId}} //checking if userid is added to studentsEnrolled
        })
        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Student is not enrolled in the course."
            })
        }
        //check if user has already reviewed the course
        const alreadyReviewed = await RatingsAndReview.findOne({
            user : userId,
            course : courseId
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success : false,
                message : "The course is already reviewed by the user."
            })
        }
        //create rating and review
        const ratingReview = await RatingsAndReview.create({rating, review, course : courseId, user : userId });
        //Update Course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {$push : {ratingAndReviews : ratingReview._id}}
        )
        console.log("updatedCourseDetails", updatedCourseDetails);
        //return response
        return res.status(200).json({
            success : true,
            message : "Rating and Review created successfully",
            data : ratingReview
        })
    }catch(err){
        console.log("Error while creating rating and review", err);
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

//getAverageRating
//getAllRating  