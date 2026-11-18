import Section from "../models/Section.js";
import Course from "../models/Course.js";

const createCourse = async (req, res) => {
    try{
        //fetch data
        const {sectionName, courseId} = req.body;
        //validate data
        if(!courseId || !sectionName){
            return res.status(500).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                {courseId},
                                                { $push : {courseContent : newSection._id}},
                                                {new : true}
                                            ).populate({
                                                path : "courseContent",
                                                populate : {path : "subSection"}
                                            })
        //return res
        res.status(200).json({
            success : true.valueOf,
            data : updatedCourseDetails,
            message : "Section Created successfully"
        })
    }catch(err) {
        console.log("Error while creating course", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}