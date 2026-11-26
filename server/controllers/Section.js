import Section from "../models/Section.js";
import Course from "../models/Course.js";

const createSection = async (req, res) => {
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
                                                courseId,
                                                { $push : {courseContent : newSection._id}},
                                                {new : true}
                                            ).populate({
                                                path : "courseContent",
                                                populate : {path : "subSection"}
                                            })
        //return res
        res.status(200).json({
            success : true,
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

const updateSection = async (req, res) => {
    try{
        //Fetch Data
        const {sectionName, sectionId} = req.body
        //Validate Data
        if(!sectionId || !sectionName){
            return res.status(500).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //Update Data
        const updateSectionData = await Section.findByIdAndUpdate(
                                                        sectionId,
                                                        {sectionName},
                                                        {new : true, runValidators : true}
                                                    )
        //Return res
        res.status(200).json({
            success : true,
            data : updateSectionData,
            message : "Section Updated successfully"
        })
    }catch(err){    
        console.log("Error while Updating Course", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const deleteSection = async (req, res) => {
    try{
        //fetch data - assuming that we are sending id in params
        const {sectionId, courseId} = req.body;
        //validate data
        if(!sectionId || !courseId){
            return res.status(500).json({
                success : false,
                message : "sectionId and courseId are required!"
            })
        }
        //delete 
        const deleteSectionRes = await Section.findByIdAndDelete(sectionId);
        if(!deleteSectionRes){
            res.status(500).json({
                success : false,
                message : " Failed to delete Section!"
            })
        }
        //Todo : Do we need to delete the entry from course schema?
        //Delete the section entry from course as well
        const deleteSectionFromCourse = await Course.findByIdAndDelete(courseId,
            {$pull : {courseContent : sectionId}}
        )
         if(!deleteSectionFromCourse){
            res.status(500).json({
                success : false,
                message : " Failed to delete Section from Course!"
            })
        }
        res.status(200).json({
            success : true,
            message : "Section deleted successfully"
        })
    }catch(err) {
        console.log("Error while Deleting Course", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {createSection, updateSection, deleteSection};