import instance from "../config/razorpay.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js";

//Capture a Payment and Initiate the Razorpay order
const capturePayment = async (req, res) => {
    try{
        //get courseId and userId
        const {course_id} = req.body;
        const userId = req.user.id;
        //Validation
        //Valid courseId
        if(!course_id){
            return res.status(500).json({
                success : false,
                message : "Please provide a valid course Id"
            })
        }
        //Valid courseDetail
        let course;
        try{
            course = await Course.findById(course_id);
            //If the course is not present
            if(!course){
                return res.status(500).json({
                    success : false,
                    message : "Could not find a course"
                })
            }
            //Check if User has already paid for the same course
            //Course schema contains the objectId of studentsEnrolled
            //We can check If the current user id is present there or not
            //Current user id is in string form and the Stored user id is objectId form
            //So, We'll first convert the string Id to ObjectId
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                 return res.status(200).json({
                    success : false,
                    message : "Student is already enrolled in the course"
                })
            }

        }catch(error){
            console.error(error);
            res.status(500).json({
                success : false,
                message : error.message
            })
        }
        //Order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount : amount * 100,
            currency,
            receipt : Date.now() * Math.random(),
            notes : {
                courseId : course_id,
                userId
            }
        }

        try{
            //Initiate the payment using Razorpay
            const paymentResponse = instance.orders.create(options);
            console.log("paymentResponse", paymentResponse);

            //Return response
            res.status(200).json({
                success : true,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail : course.thumbnail,
                orderId : paymentResponse.id,
                currency : paymentResponse.currency,
                amount : paymentResponse.amount 
            })

        }catch(err){
            console.log(err);
            res.status(500).json({
                success : false,
                message : "Could not initiate order"
            })
        }
    }catch(err) {
         console.log("Error occoured while payment", err);
            res.status(500).json({
                success : false,
                message : err.message
            })
    }
}

//Verify signature of Razorpay and Server
const verifySignature = async (req, res) => {
    try{
        const webHookSecret = "12345678";
        const signature = req.headers("x-razorpay-signature");
        //Razorpay sents a secret key using hashing, We cant hashback it to its original form
        //So, The key we have here on server, we'll hash it and compare it with razorpay key
        //HMAC - It needs Hashing Algo and Secret Key [Here we specify which hashing algorithm we use and using which secret key]
        const shasum = crypto.createHmac("sha256", webHookSecret);
        shasum.update(json.stringify(req.body));
        const digest = shasum.digest("hex");

        if(signature === digest){
            console.log("Payment is Authorized!");

            //This request is coming from razorpay, so we dont have courseId and userId from req.body
            //So, We had added that in capturePayment -> options -> notes

            const {courseId, userId} = req.body.payload.payment.entity.notes;
            try{
                //fulfill the action

                //Find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    {_id : courseId},
                    {$push : {studentsEnrolled : userId}},
                    {new : true}
                )
                if(!enrolledCourse){
                    return res.status(500).json({
                        success : false,
                        message : "Course not found!"
                    })
                }
                console.log("EnrolledCourse", enrolledCourse);

                //Find the student and add course to their courses
                const enrolledStudent = await User.findOneAndUpdate(
                    userId,
                    {$push : {courses :courseId}},
                    {new : true}
                )
                console.log("enrolledStudent", enrolledStudent);

                //Send Confirmation Email to Student
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congradulation from StudyNotion",
                    courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
                )
                console.log("emailResponse", emailResponse);

                return res.status(200).json({
                    success : true,
                    message : "Signature Verified and Course Added"
                })
            }catch(err){    
                console.error(err);
                return res.status(500).json({
                    success : false,
                    message : err.message
                })
            }
        }else{
            return res.status(400).json({
                success : false,
                message : "Invalid Request"
            })
        }
    }catch(err){
        console.log("Error occoured while verifying signature", err);
            res.status(500).json({
                success : false,
                message : err.message
            })
    }
}

export {capturePayment, verifySignature};