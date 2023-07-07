import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { deleteImage, uploadImage } from "../controllers/upImages";
import cloudinary from "../config/cloudinary";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images_noname",
    format: "png",
  },
});

const upload = multer({ storage: storage });

router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);

export default router;
