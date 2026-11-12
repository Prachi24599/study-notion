import Category from "../models/Category.js";

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
            message : "All tags are returned successfully!",
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

export {getAllCategory, createCategory};