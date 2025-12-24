import { Request, Response, NextFunction } from "express";
import uploader from "../utils/uploader";

const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const multerUploader = uploader.single("image"); // Accept up to 10 files

  multerUploader(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        name: "FileUploadError",
        message: err.message || "File upload error",
        statusCode: 400,
        error: "Bad Request",
      });
    }
    next();
  });
};

export default fileUploadMiddleware;
