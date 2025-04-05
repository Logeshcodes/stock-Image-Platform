"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageController_1 = require("../controllers/ImageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/upload", authMiddleware_1.authMiddleware, upload.array("images"), ImageController_1.uploadImages);
router.get("/getImage", authMiddleware_1.authMiddleware, ImageController_1.getImages);
router.put("/updateOrder", ImageController_1.updateImageOrder);
router.delete("/delete-image/:id", ImageController_1.deleteImage);
router.put("/edit-image/:id", authMiddleware_1.authMiddleware, ImageController_1.editImageTitle);
router.put("/edit/:id", authMiddleware_1.authMiddleware, upload.single("image"), ImageController_1.editImage);
exports.default = router;
