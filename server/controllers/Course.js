import Course from "../models/Course.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import uploadImageToCloudinary from "../utils/emailUploader.js";
import dotenv from "dotenv";
dotenv.config();

const createCourse = async (req, res) => {
    try{  
        //fetch Data  
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //check the instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById({userId});
        console.log("instructorDetails", instructorDetails);
        //TODO - check weather userId and instructorDetails._id are same or different??

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "Instructor details not found!"
            })
        }

        //check given category valid or not
        const categoryDetails = await Category.findById({category});
        if(!categoryDetails){
            return res.status(404).json({
                success : false,
                message : "Category details not found!"
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            category : categoryDetails._id,
            thumbnail : thumbnailImage.secure_url
        })

        //add a new course to the user schema of Instructor 
        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push : {
                    courses : newCourse._id
                }
            },
            {new : true}
        )

        //update the Category Schema
        await Category.findByIdAndUpdate(
            {_id : categoryDetails._id},
            {
                $push : {
                    courses : newCourse._id
                }
            },
            {new : true}
        )

        //return response
        res.status(200).json({
            success : true,
            data : newCourse,
            message : "Course created successfully!"
        })
    }catch(err){
        console.log("Error while creating course", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const showAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({}, {
            courseName : true,
            price : true,
            thumbnail : true,
            instructor : true,
            ratingAndReviews : true,
            studentsEnrolled : true,
        }).populate("instrctor").exec();

        res.status(200).json({
            success : true,
            data : allCourses,
            message : "All courses successfully!"
        })
    }catch(err){
        console.log("Error while fetching courses", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {createCourse, showAllCourses};