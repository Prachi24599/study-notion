import RatingsAndReview from "../models/RatingAndReview.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";

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
const getAverageRating = async (req, res) => {
    try{
        //get course id
        const {courseId} = req.body;
        //calculate average rating
        const result = await RatingsAndReview.aggregate([
            {
                $match : {
                    course : new mongoose.Types.ObjectId(courseId) //fetch the course with matched the courseId, converting courseId from string to object
                },
            },
            {
                $group : {
                    _id : null, //We dont have any field to group by so added null
                    averageRating : {$avg : "$rating"},
                }
            }
        ])
        console.log("result", result);
        
        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating
            })
        }

        //If no rating or review exits
        res.status(200).json({
            success : true,
            averageRating : 0,
            message : "Average rating is 0, no ratings given till now"
        })
    }catch(err){
        console.log("Error while fetching average rating", err);
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

//fetch all rating and review
const getAllRatingAndReviews = async (req, res) => {
    try{
        const allRatingAndReview = await RatingsAndReview.find()
                                                    .sort({rating : desc})
                                                    .populate({
                                                        path : "user",
                                                        select : "firstName lastName email image"
                                                    })
                                                    .populate({
                                                        path : "course",
                                                        select : "courseName"
                                                    })
                                                    .exec();

        if(!allRatingAndReview){
            return res.status(200).json({
                success : true,
                message : `No rating and reviews available`,
                data : 0
            })
        }

        return res.status(200).json({
            success : true,
            message : "Rating and Reviews fetched successfully!",
            data : allRatingAndReview
        })
    }catch(err) {
        console.log("Error while fetching all rating and reviews", err);
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {createRatingandReview, getAverageRating, getAllRatingAndReviews}