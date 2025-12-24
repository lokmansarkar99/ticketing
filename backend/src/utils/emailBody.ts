export const generateTicketEmailBody = ({
  passengerName,
  ticketNumber,
  date,
  departureTime,
  boardingPoint,
  destination,
  busType,
  seatNumber,
  fareAmount,
}: {
  passengerName: string;
  ticketNumber: string;
  date: string;
  departureTime: string;
  boardingPoint: string;
  destination: string;
  busType: string;
  seatNumber: string[];
  fareAmount: number;
}) => `
  <div style="font-family: Arial, sans-serif;  color: #333;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://iconicticket.com/assets/longeng-Dg6C7B0x.png" alt="Iconic Express Logo" style="height: 60px;" />
    </div>


    <p>Dear <strong> ${passengerName}</strong>,</p>
    <p>Thank you for choosing <span style="color:#8e44ad"><strong>Iconic Express</strong></span> for your journey!</p>
    <p>We are pleased to confirm your bus ticket booking. Below are your travel details:</p>

    <h4 style="color:#8e44ad;">Journey Details</h4>
    <p><strong>Passenger Name:</strong> ${passengerName}</p>
    <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
    <p><strong>Date of Journey:</strong> ${date}</p>
    <p><strong>Departure Time:</strong> ${departureTime}</p>
    <p><strong>Boarding Point:</strong> ${boardingPoint}</p>
    <p><strong>Destination:</strong> ${destination}</p>
    <p><strong>Bus Type:</strong> ${busType}</p>

    <h4 style="color:#8e44ad;">Seat Details</h4>
    <p><strong>Seat Number:</strong> ${seatNumber.join(', ')}</p>
    <p><strong>Fare:</strong> ${fareAmount} ৳</p>
    <p><strong>Payment Status:</strong> Confirmed / Paid</p>

    <h4 style="color:#e84393;">Important Instructions:</h4>
    <ul>
      <li>Please arrive at the boarding point at least <strong>15 minutes</strong> before departure.</li>
      <li>Carry a <strong>valid ID proof</strong> and this email (printed or digital) for verification.</li>
      <li>For any changes or cancellations, please contact our support team.</li>
    </ul>

    <hr style="margin: 30px 0;" />

    <div style="text-align: center; color: #555;">
      <img src="https://iconicticket.com/assets/longeng-Dg6C7B0x.png" alt="Iconic Express Logo" style="height: 50px; margin-bottom: 10px;" />
      <p style="margin: 4px 0;"><strong>Iconic Express</strong></p>
      <p style="margin: 2px 0;">Phone: 01824-800900 | Email: abcd@iconicticket.com</p>
      <p style="margin: 2px 0;">Website: <a href="https://www.iconicticket.com">www.iconicticket.com</a></p>
      <p style="margin: 2px 0;">Thank you for traveling with us!</p>
    </div>
  </div>
`;
