import Course from "../models/Course.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import uploadFileToCloudinary from "../utils/fileUploader.js";
import dotenv from "dotenv";
dotenv.config();

const createCourse = async (req, res) => {
    try{  
        //fetch Data  
        let {courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category || !thumbnail){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        if (!status || status === undefined) {
			status = "Draft";
		}
        //check the instructor
        const userId = req.user.id;
        //check if user is an instructor
        const instructorDetails = await User.findById(userId, {accountType : "Instructor"});
        console.log("instructorDetails", instructorDetails);
        //TODO - check weather userId and instructorDetails._id are same or different??

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "Instructor details not found!"
            })
        }

        //check given category valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success : false,
                message : "Category details not found!"
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            tag : tag,
            category : categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
            status : status,
            instructions : instructions
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
        }).populate("instructor", "firstName lastName image")
          .exec();

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

const getCourseDetails = async (req, res) => {
    try{
        //get data
        const {courseId} = req.body;
        //validate
        if(!courseId){
            return res.status(400).json({
                success : false,
                message : "courseId is required"
            })
        }
        //fetch course details
        //Course.findById(courseId) is a shorthand for Course.findOne({ _id: courseId }) 
        const courseDetail = await Course.findById(courseId)
                                                    .populate(
                                                        {
                                                            path : "instructor",
                                                            select : "firstName lastName email accountType additionalDetails courses image",
                                                            populate : [
                                                                {path : "additionalDetails"},
                                                                {path : "courses"}
                                                            ]
                                                        }
                                                    )
                                                    .populate(
                                                        {
                                                            path : "courseContent", 
                                                            populate : {path : "subSection"}
                                                        })
                                                    .populate("ratingAndReviews")
                                                    .populate("category")
                                                    .populate("studentsEnrolled")
                                                    .exec();
        if(!courseDetail){
            return res.status(404).json({
                success : false,
                message : "Error while fetching course details from DB"
            })
        }
        //return response
        return res.status(200).json({
            success : true,
            data : courseDetail,
            message : "course details fetched successfully!"
        })
    }catch(err){
        console.log("Error while fetching course details", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}
export {createCourse, showAllCourses, getCourseDetails};