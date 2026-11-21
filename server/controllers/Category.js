import Category from "../models/Category.js";
import Course from "../models/Course.js";

const createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //create entry in DB
        const categoryDetails = await Category.create({
            name : name,
            description : description
        })
        console.log("category Details", categoryDetails);
        //Return response
        res.status(200).json({
            success : true,
            message : "Category created successfuly!"
        })
    }catch(err) {
        console.log("Error while creating category", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const getAllCategory = async (req, res) => {
    try{
        const allCategory = await Category.find({}, {name : true, description : true});
        res.status(200).json({
            success : true,
            message : "All categories are returned successfully!",
            data : allCategory
        })
         
    }catch(err) {
        console.log("Error while fetching all category", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const categoryPageDetails = async (req, res) => {
    try{
        //get data
        const {categoryId} = req.body;
        //get coursed for specified categoryId
        const selectedCategoryCourses = await Category.findById(categoryId)
                                                    .populate("courses")
                                                    .exec();
        //validation
        if(!selectedCategoryCourses){
            return res.status(404).json({
                success : false,
                message : "Data not found!"
            })
        }

        //get courses for different categories
        const differentCategories = await Category.find({
                                        _id : {$ne : categoryId}, //ne = not equal to given category id
                                    }).populate("courses").exec();
        
        //TODO - Which course has selling faster
        //Find top 10 seliing courses
        //We need to fetch all the courses it's sstudentsEnrolled count with descending order 
        const topSellingCourses = await Course.aggregate([
            {
                $addFields : {
                    enrollmentCount : {
                        $size : {ifNull : ["$studentsEnrolled", []]}
                    }
                }
            },
            {$sort : {enrollmentCount : -1}},
            {$limit : 10},
            {
                $project : {
                    courseName : 1,
                    price : 1,
                    thumbNail : 1,
                    enrollmentCount : 1
                }
            }
        ])
        return res.status(200).json({
            success : true,
            data : {
                selectedCategoryCourses,
                differentCategories,
                topSellingCourses
            }
        })
        
    }catch(err){ 
        console.log("Error while fetching category page details", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {getAllCategory, createCategory, categoryPageDetails} ;