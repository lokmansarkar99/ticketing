import { generateTicketEmailBody } from "./emailBody";
import { generateTicketPDF } from "./generateTicketPdf";
import prisma from "./prisma";
import sendMail from "./sendEmail";
import { sendSMS } from "./sendSMS";

const sendEmailAndSms = async (id: number) => {

    const findOrder = await prisma.order.findUnique({
        where: {
            id: id
        },
        include: {
            returnOrder: {
                include: {
                    orderSeat: true,

                    coachConfig: {
                        include: {
                            coach: {
                                include: {
                                    route: {
                                        include: {
                                            viaRoute: true,
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },
            orderSeat: true,

            coachConfig: {
                include: {
                    coach: {
                        include: {
                            route: {
                                include: {
                                    viaRoute: true,
                                }
                            }
                        }
                    },
                }
            }
        }
    })
    if (!findOrder) {
        return {
            success: false,
            statusCode: 404,
            message: "Order not found"
        };
    }
    if (findOrder.status === "Success" && findOrder.dueAmount === 0 && findOrder.email) {
        const mailBody = {
            passengerName: findOrder.customerName || 'N/A',
            ticketNumber: findOrder.ticketNo || 'N/A',
            date: findOrder.date || 'N/A',
            departureTime: findOrder.coachConfig.coach.schedule || 'N/A',
            boardingPoint: findOrder.boardingPoint || 'N/A',
            destination: findOrder.droppingPoint || 'N/A',
            busType: findOrder.coachConfig.coach.coachType || 'N/A',
            seatNumber: findOrder.orderSeat.map((seat: any) => seat.seat) || 'N/A',
            fareAmount: findOrder.amount,
        }

        const date = findOrder.createdAt;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        const pdfBody = {
            ticketNumber: findOrder.ticketNo || 'N/A',
            coachNo: findOrder.coachConfig.coachNo || 'N/A',
            name: findOrder.customerName || 'N/A',
            mobile: findOrder.phone || 'N/A',
            boardingPoint: findOrder.boardingPoint || 'N/A',
            droppingPoint: findOrder.droppingPoint || 'N/A',
            journeyDate: findOrder.coachConfig.departureDate || 'N/A',
            issueDate: `${day}-${month}-${year}`,
            // reportingTime: string;
            departureTime: findOrder.coachConfig.coach.schedule || 'N/A',
            seatFare: findOrder.amount / findOrder.noOfSeat,
            totalFare: findOrder.amount,
            seatNo: findOrder.orderSeat.map((seat: any) => seat.seat) || 'N/A',
        }
        let pdfBody2;
        if (findOrder.returnOrder) {
            const returnDate = findOrder.returnOrder.createdAt;
            const returnDay = String(returnDate.getDate()).padStart(2, '0');
            const returnMonth = String(returnDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const returnYear = returnDate.getFullYear();
            pdfBody2 = {
                ticketNumber: findOrder.returnOrder.ticketNo || 'N/A',
                coachNo: findOrder.returnOrder.coachConfig.coachNo || 'N/A',
                name: findOrder.returnOrder.customerName || 'N/A',
                mobile: findOrder.returnOrder.phone || 'N/A',
                boardingPoint: findOrder.returnOrder.boardingPoint || 'N/A',
                droppingPoint: findOrder.returnOrder.droppingPoint || 'N/A',
                journeyDate: findOrder.returnOrder.coachConfig.departureDate || 'N/A',
                issueDate: `${returnDay}-${returnMonth}-${returnYear}`,
                // reportingTime: string;
                departureTime: findOrder.returnOrder.coachConfig.coach.schedule || 'N/A',
                seatFare: findOrder.returnOrder.amount / findOrder.returnOrder.noOfSeat,
                totalFare: findOrder.returnOrder.amount,
                seatNo: findOrder.returnOrder.orderSeat.map((seat: any) => seat.seat) || 'N/A',
            }
        }

        const emailBody = generateTicketEmailBody(mailBody);
        const pdfBuffer = await generateTicketPDF(pdfBody);
        let pdfBuffer2;
        if (pdfBody2) {
            pdfBuffer2 = await generateTicketPDF(pdfBody2);
        }

        await sendMail({
            email: findOrder.email,
            subject: "Your Ticket is Confirmed – Iconic Express",
            message: emailBody,
            messageType: "html",
            attachment: pdfBuffer, // optional: pass to modify sendMail
            returnPdf: pdfBuffer2, // optional: pass to modify sendMail
        });
    }

    if (findOrder.phone) {
        const findTime = findOrder.coachConfig.coach.route.viaRoute.find((r: any) => r.routeId === findOrder.orderSeat[0].fromStationId)
        const dd = await sendSMS(
            findOrder.phone,
            `
Iconic Express
${findOrder.boardingPoint || 'N/A'},->${findOrder.droppingPoint || 'N/A'},
TKT: ${findOrder.ticketNo || 'N/A'}
PIN: BC7189623-D1EIWC9EHZ
DOJ: ${findOrder.date}:${findTime?.schedule || '09:00 PM'},
SEATS: ${findOrder.orderSeat.map((seat: any) => seat.seat) || 'N/A'},
COACH: ${findOrder.coachConfig.coach.coachNo}
FARE: ${findOrder.amount}
DUE : ${findOrder.dueAmount}
HELP: 01824-800900`
        );
        console.log({ dd })
    }

    if (findOrder.returnOrder) {
        const findReturnTime = findOrder.returnOrder.coachConfig.coach.route.viaRoute.find((r: any) => r.routeId === findOrder.orderSeat[0].fromStationId)
        const dd = await sendSMS(
            findOrder.returnOrder.phone,
            `
Iconic Express
${findOrder.returnOrder.boardingPoint || 'N/A'},->${findOrder.returnOrder.droppingPoint || 'N/A'},
TKT: ${findOrder.ticketNo || 'N/A'}
PIN: BC7189623-D1EIWC9EHZ
DOJ: ${findOrder.returnOrder.date}:${findReturnTime?.schedule || '09:00 PM'},
SEATS: ${findOrder.returnOrder.orderSeat.map((seat: any) => seat.seat) || 'N/A'},
COACH: ${findOrder.returnOrder.coachConfig.coach.coachNo}
FARE: ${findOrder.returnOrder.amount}
DUE : ${findOrder.dueAmount}
HELP: 01824-800900`
        );
        console.log({ dd })
    }
}


export default sendEmailAndSms;