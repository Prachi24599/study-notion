import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
    try{
        const transporter = nodeMailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        })

        const sendMail = transporter.sendMail({
            from : "StudyNotion - Prachi",
            to : `${email}`,
            subject : `${title}`,
            body : `${body}`
        })

        console.log("SendMail", sendMail);
        return sendMail;
        
    }catch(err){
        console.log("Error in mailsender", err);
    }
}

export default mailSender;