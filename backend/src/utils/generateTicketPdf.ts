import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export const generateTicketPDF = async (data: {
  ticketNumber: string;
  coachNo: string;
  name: string;
  mobile: string;
  boardingPoint: string;
  droppingPoint: string;
  journeyDate: string;
  issueDate: string;
  // reportingTime: string;
  departureTime: string;
  seatFare: number;
  totalFare: number;
  seatNo: string[];
}) => {
  const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket-box { border: 1px solid #000; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { height: 60px; margin-bottom: 10px; }
          .footer { margin-top: 20px; background: #d833a6; color: #fff; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="ticket-box">
          <div class="header">
            <img src="https://iconicticket.com/assets/longeng-Dg6C7B0x.png" alt="Iconic Express Logo" />
            <h2>Iconic Express – Online Ticket</h2>
          </div>
  
          <p><strong>Ticket No:</strong> ${data.ticketNumber}</p>
          <p><strong>Coach No:</strong> ${data.coachNo}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Mobile:</strong> ${data.mobile}</p>
          <p><strong>Boarding Point:</strong> ${data.boardingPoint}</p>
          <p><strong>Dropping Point:</strong> ${data.droppingPoint}</p>
          <p><strong>Journey Date:</strong> ${data.journeyDate}</p>
          <p><strong>Issue Date:</strong> ${data.issueDate}</p>
          
          <p><strong>Departure Time:</strong> ${data.departureTime}</p>
          <p><strong>Seat Fare:</strong> ${data.seatFare} ৳</p>
          <p><strong>Total Fare:</strong> ${data.totalFare} ৳</p>
          <p><strong>Seat No:</strong> ${data.seatNo}</p>
  
          <div style="margin-top: 20px; text-align: center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${data.ticketNumber}" alt="QR Code"/>
          </div>
        </div>
  
        <div class="footer">
          Please keep your luggage under your own responsibility. Thank you. <br />
          For Online Ticket: https://iconic-beta.netlify.app/
        </div>
      </body>
      </html>
    `;

  // <p><strong>Reporting Time:</strong> ${data.reportingTime}</p>

  const browser = await puppeteer.launch({
    executablePath: '/home/ubuntu/.cache/puppeteer/chrome/linux-136.0.7103.94/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
};

