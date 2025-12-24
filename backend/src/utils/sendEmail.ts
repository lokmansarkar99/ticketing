import nodemailer from "nodemailer";
import { ISendMail } from "../types/interface";

const sendMail = async ({
    email,
    message,
    subject,
    attachment,
    returnPdf,
    messageType = "html",
}: ISendMail) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions: any = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
    };
    if (attachment) {
        mailOptions.attachments = [
            {
                filename: "Journey_Ticket.pdf",
                content: attachment, // from generateTicketPDF
                contentType: 'application/pdf',
            },
        ];
        if(returnPdf){
            mailOptions.attachments.push({
                filename: "Return_Ticket.pdf",
                content: returnPdf, // from generateTicketPDF
                contentType: 'application/pdf',
            });
        }
    }



    mailOptions[messageType] = message;

    try {
        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        throw new Error(error);
    }
};

export default sendMail;
