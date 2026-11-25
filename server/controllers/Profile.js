import Profile from "../models/Profile.js";
import User from "../models/User.js";
import uploadFileToCloudinary from "../utils/fileUploader.js";

const updateProfile = async (req, res) => {
    try{
        //Get Data
        const {dateOfBirth = "", about = "", contactNumber, gender} = req.body;
        //Get UserId
        const id = req.user.id;
        //Validation
        if(!contactNumber || !gender){
            return res.status(500).json({
                success : false,
                message : "Required fields missing!"
            })
        }
        //Find Profile
        //We need to find Profile Details but as we dont have profile id yet we will first find the userdetails
        //And from userDetails, We can find profileId
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        const profileDetails = await Profile.findById(userDetails.additionalDetails);
        if(!profileDetails){
            return res.status(404).json({
                success : false,
                message : "Profile not found"
            })
        }
        //Update Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender

        await profileDetails.save();
        //Return Res
         res.status(200).json({
            success : true,
            data : profileDetails,
            message : "Profile updated successfully"
        })

    }catch(err) {
        console.log("Error while Updating Profile", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const deleteAccount = async (req, res) => {
    try{
        //fetch data
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        //delete user profile first
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        //Todo : Unenroll user from all enrolled courses

        //delete user
        await User.findByIdAndDelete(id)
        //return res
        res.status(200).json({
            success : true,
            message : "Profile deleted successfully"
        })
    }catch(err){
        console.log("Error while deleting account", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}
//How to schedule a job to execute after particular amount of time
//crone job

const getAllUserDetails = async (req, res) => {
    try{    
        //fetch id
        const id = req.user.id;

        //validate and getUserDetails 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return res
        return res.status(200).json({
            success : true,
            data : userDetails,
            message : "User data fetched successfully"
        })

    }catch(err){
        console.log("Error while fetching user details", err);
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}   

const updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadFileToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

export {updateProfile, deleteAccount, getAllUserDetails, updateDisplayPicture};

