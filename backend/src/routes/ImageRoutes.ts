import express from "express";
import { uploadImages, getImages, deleteImage, updateImageOrder, editImageTitle, editImage } from "../controllers/ImageController";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer"; 

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", authMiddleware, upload.array("images"), uploadImages);
router.get("/getImage", authMiddleware, getImages);
router.put("/updateOrder", updateImageOrder);
router.delete("/delete-image/:id", deleteImage);
router.put("/edit-image/:id", authMiddleware, editImageTitle);
router.put("/edit/:id", authMiddleware, upload.single("image"), editImage);

export default router;
