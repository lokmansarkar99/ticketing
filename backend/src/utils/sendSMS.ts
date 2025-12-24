import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const smsUrl = 'https://sms.mram.com.bd/smsapi';

export const sendSMS = async (number: string, message: string) => {
  try {
    const response = await axios.get(smsUrl, {
      data: {
        api_key: process.env.SMS_API_KEY,
        senderid: process.env.SENDER_ID,
        contacts: number,  // Recipient number (comma-separated for multiple)
        msg: (message), // URL encode message
        type: 'text',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};
