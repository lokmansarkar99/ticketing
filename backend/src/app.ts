import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import router from './router/router';
import { createServer } from 'http';
import errorHandler, { notfoundandler } from './middleware/errorHandler';
import swaggerUi from "swagger-ui-express";
import swaggerConfig from './config/swagger.config';
import prisma from './utils/prisma';
import { generateTicketEmailBody } from './utils/emailBody';
import { generateTicketPDF } from './utils/generateTicketPdf';
import sendMail from './utils/sendEmail';
import { sendSMS } from './utils/sendSMS';
const app: Application = express();

const allowedOrigin = 'http://localhost:3000';
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));


app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const enforceHostCheck = (req: Request, res: Response, next: NextFunction) => {
    const host = req.get('host');
    if (host === 'localhost:3000') {
        next();
    } else {
        res.status(403).send({
            success: false,
            message: 'Forbidden'
        });
    }
};

// Use the Host check middleware
// app.use(enforceHostCheck);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));


app.get('/', async (req: Request, res: Response) => {
    res.status(200)
        .send(
            {
                success: true,
                message: 'Iconic Server Is Running',
            }
        )
});

app.get('/cicd', async(req:Request, res: Response) => {
    res.status(200).send({
        success:true,
        message: "CI CD Working"
    })
})

app.use('/api/v1', router);

app.use(notfoundandler);
app.use(errorHandler);

const server = createServer(app)

export default server;