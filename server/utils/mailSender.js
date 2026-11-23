import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
    const transporter = nodeMailer.createTransport({
        host : process.env.MAIL_HOST,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }
    })

    const mailResponse = await transporter.sendMail({
        from : "StudyNotion - Prachi",
        to : `${email}`,
        subject : `${title}`,
        html : `${body}`
    })

    console.log("Email sent", mailResponse);
    return mailResponse;
}

export default mailSender;