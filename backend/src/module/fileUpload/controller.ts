import { NextFunction, Request, Response } from "express";
import { s3, uploadToS3 } from "../../utils/uploader";
import config from "../../config";
import { DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"; // ✅ Ensure this is imported correctly

export const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File; // <-- single file

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFile = await uploadToS3(req); // returns { url: "" }

    res.status(200).json({
      success: true,
      data: uploadedFile?.url, // no [0]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFromS3 = async (req: Request, res: Response) => {
  try {
    const {key} = req.query;

    if (!key) {
      return res.status(400).json({ success: false, message: "File URL is required key" });
    }

    
   

    // **Check if the file exists**
    try {
      await s3.send(new HeadObjectCommand({ Bucket: config.aws_bucket_name!, Key: key as string }));
    } catch (error: any) {
      return res.status(404).json({ success: false, message: "File does not exist in S3" });
    }

    // **Delete the object**
    await s3.send(new DeleteObjectCommand({ Bucket: config.aws_bucket_name!, Key: key as string }));

    return res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

export const getAllImageFromS3 = async (req:Request, res:Response,next:NextFunction) =>{
  try{
 const command = new ListObjectsV2Command({
    Bucket: config.aws_bucket_name!,
    Prefix: "uploads/",
  });

  const result = await s3.send(command);

  const images = result.Contents?.map(obj => ({
    key: obj.Key,
    url: `${config.aws_cloudfront_url}/${obj.Key}`,
  })) || [];

  res.status(200).send({
    success: true,
    data: images
  })

  }
  catch(err){
    next(err)
  }
}


