import Section from "../models/Section.js";
import Course from "../models/Course.js";

const createSection = async (req, res) => {
    try{
        //fetch data
        const {sectionName, courseId} = req.body;
        //validate data
        if(!courseId || typeof sectionName !== "string" || !sectionName.trim()){
            return res.status(400).json({
                success : false,
                message : "A valid courseId and sectionName are required!"
            })
        }

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found!"
            })
        }

        //create section
        const newSection = await Section.create({sectionName : sectionName.trim()});
        //update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            { $push : {courseContent : newSection._id}},
            { returnDocument : "after" }
        ).populate({
            path : "courseContent",
            populate : {path : "subSection"}
        })
        if(!updatedCourseDetails){
            await Section.findByIdAndDelete(newSection._id);
            return res.status(404).json({
                success : false,
                message : "Course not found!"
            })
        }

        //return res
        return res.status(200).json({
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
        //fetch data
        const {sectionId, courseId} = req.body;
        //validate data
        if(!sectionId || !courseId){
            return res.status(400).json({
                success : false,
                message : "sectionId and courseId are required!"
            })
        }
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success : false,
                message : "Section not found!"
            })
        }

        const course = await Course.findOneAndUpdate(
            {_id : courseId, courseContent : sectionId},
            {$pull : {courseContent : sectionId}}
        )
        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course or section reference not found!"
            })
        }

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
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