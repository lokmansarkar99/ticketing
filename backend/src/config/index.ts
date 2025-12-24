import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  auth_token: process.env.AUTH_TOKEN,
  auth_token_expires_in: process.env.AUTH_TOKEN_EXPIRES_IN,
  refresh_token: process.env.REFRESH_TOKEN,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  otp_token: process.env.OTP_TOKEN,
  otp_token_expires_in: process.env.OTP_TOKEN_EXPIRES_IN,
  cloude_name: process.env.CLOUD_NAME,
  cloude_api_key: process.env.CLOUD_API_KEY,
  cloude_secret_key: process.env.CLOUD_SECRET_KEY,
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_key: process.env.AWS_SECRET_KEY,
  aws_region_name: process.env.AWS_REGION_NAME,
  aws_bucket_name: process.env.AWS_BUCKET_NAME,
  aws_cloudfront_url: process.env.AWS_CLOUDFRONT_URL,
  sslStoreId: process.env.SSL_STORE_ID,
  sslStorePass: process.env.SSL_STORE_PASS,
}
