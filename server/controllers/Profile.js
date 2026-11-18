import Profile from "../models/Profile.js";
import User from "../models/User.js";

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
        const userDetails = await User.find({id});
        const profileId = await userDetails.additionalDetails;
        const profileDetails = await Profile.findById({profileId});
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