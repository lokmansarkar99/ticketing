import multer from "multer";
import { 
  S3Client, 
  PutObjectCommand, 
  HeadObjectCommand 
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { Request } from "express";
import config from "../config";

// =============================
// S3 CLIENT INITIALIZATION
// =============================
export const s3 = new S3Client({
  region: config.aws_region_name,
  credentials: {
    accessKeyId: config.aws_access_key!,
    secretAccessKey: config.aws_secret_key!,
  },
});

// =============================
// MULTER CONFIG
// =============================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 15, // 15 MB
  },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png, .webp files are allowed!"));
    }
  },
});

export default upload;

// =============================
// UPLOAD IMAGE TO S3 (SINGLE)
// =============================
export const uploadToS3 = async (req: Request) => {
  const file = req.file as Express.Multer.File;
  const alt = req.body.alt;

  if (!file) return null;


  // =============================
  // STEP 1: HANDLE BASE64 DATA URL
  // =============================
  let imgBuffer = file.buffer;
  const bufferText = imgBuffer.toString();

  if (bufferText.startsWith("data:image")) {
    console.log("⚠ Base64 detected → converting to binary");
    const base64Data = bufferText.split(";base64,")[1];
    imgBuffer = Buffer.from(base64Data, "base64");
  }

  // =============================
  // STEP 2: VALIDATE IMAGE METADATA
  // =============================
  try {
    const meta = await sharp(imgBuffer).metadata();
    console.log("🔍 Image metadata found:", meta);
  } catch (err: any) {
    console.log("❌ Metadata read failed:", err.message);
    throw new Error("Invalid or unsupported image file (metadata check failed)");
  }

  // =============================
  // STEP 3: PROCESS IMAGE (RESIZE + JPEG)
  // =============================
  let processedBuffer;
  try {
    processedBuffer = await sharp(imgBuffer)
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 100, progressive: true })
      .toBuffer();
  } catch (err: any) {
    console.log("❌ Sharp decode failed → trying fallback:", err.message);
    processedBuffer = await sharp(imgBuffer)
      .png()
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 100 })
      .toBuffer();
  }

  // =============================
  // STEP 4: SANITIZE FILE NAME
  // =============================
  const sanitizedName = alt?.trim()
    ? alt.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : file.originalname.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  let finalFileName = `uploads/${sanitizedName}`;
  let counter = 1;

  // =============================
  // STEP 5: MAKE UNIQUE NAME ON S3
  // =============================
  while (true) {
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: config.aws_bucket_name!,
          Key: `${finalFileName}.jpg`,
        })
      );
      counter++;
      finalFileName = `uploads/${sanitizedName}-${counter}`;
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) break;
      throw err;
    }
  }

  finalFileName += ".jpg";

  // =============================
  // STEP 6: UPLOAD TO S3
  // =============================
  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws_bucket_name!,
      Key: finalFileName,
      Body: processedBuffer,
      ContentType: "image/jpeg",
    })
  );

  return {
    url: `${config.aws_cloudfront_url}/${finalFileName}`,
  };
};
