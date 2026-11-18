import SubSection from "../models/SubSection.js";
import Section from "../models/Section.js";
import uploadFileToCloudinary from "../utils/fileUploader.js";
import dotenv from "dotenv";
dotenv.config();

const createSubSection = async (req, res) => {
    try{
        //fetch data from req.body
        const {sectionId, title, timeDuration, description} = req.body;
        //extract video/file
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
        //create a subsection
        const subSectionDetails = await SubSection.create({title, description, timeDuration, videoUrl : uploadDetails.secure_url});
        // Add this sectionId in the Section -> subSection array
        const updatedSection = await Section.findByIdAndUpdate(
                                                        sectionId,
                                                        {$push : {subSection : subSectionDetails._id}},
                                                        {new : true}
                                                    ).populate();
        console.log("UpdatedSection", updatedSection);
        //return response
         res.status(200).json({
            success : true,
            data : updatedSection,
            message : "SubSection Created successfully"
        })
    }catch(err){
        console.log("Error while Creating SubSection", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const updateSubSection = async (req, res) => {
    try{
        //fetch data
        const {subSectionId, timeDuration, title, description} = req.body;
        //extract video/file
        const video = req?.files?.videoFile;
        //validation
        if(!subSectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success : false,
                message : "All fields are required!"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
        //update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            {timeDuration, title, description, videoUrl : uploadDetails?.secure_url},
            {new : true, runValidators : true}
        )

        console.log("UpdatedSection", updatedSubSection);
        
        //If subsection is not found
        if(!updatedSubSection){
            return res.status(404).json({
                success: false,
                message: "Subsection not found."
            });
        }

        //return response
         res.status(200).json({
            success : true,
            data : updatedSubSection,
            message : "SubSection Updated successfully"
        })
    }catch(err) {
        console.log("Error while updating SubSection", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const deleteSubSection = async (req, res) => {
    try{
        //get subsectionId and sectionId
        //If we are deleting the subsection, then we should also remove it's reference from the section array
        const {sectionId, subSectionId} = req.body;
        //validate
        if(!sectionId || !subSectionId) {
            return res.status(404).json({
                success : false,
                message : "subsectionid  and sectionId are required"
            })
        }

        //first delete the reference from section
        const sectionData = await Section.findOneAndUpdate(
            {_id : sectionId, subSection : subSectionId},
            {$pull : {subSection : subSectionId}},
            {new : true}
        )

        if(!sectionData){
            return res.status(404).json({
                success: false,
                message: "Section or subsection reference not found."
            });
        }
        //check if subsection present
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if(!deletedSubSection){
            return res.status(404).json({
                success: false,
                message: "Subsection not found."
            });
        }
        //Todo : Need to delete the video stored in cloudinary
        //return res
         res.status(200).json({
            success : true,
            message : "SubSection Deleted successfully"
        })
    }catch(err) {
        console.log("Error while deleting SubSection", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export {createSubSection, updateSubSection, deleteSubSection}