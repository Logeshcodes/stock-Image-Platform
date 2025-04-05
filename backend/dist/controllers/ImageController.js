"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editImage = exports.editImageTitle = exports.rearrangeImages = exports.updateImageOrder = exports.deleteImage = exports.getImages = exports.uploadImages = void 0;
const ImageService_1 = require("../services/ImageService");
const ImageRepository_1 = require("../repositories/ImageRepository");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const imageSvc = (0, ImageService_1.imageService)(ImageRepository_1.imageRepository);
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const images = req.files;
        const { titles } = req.body;
        const uploadedImages = yield imageSvc.uploadImages(images, userId, titles);
        res.status(201).json(uploadedImages);
    }
    catch (error) {
        res.status(500).json({ error: "Image upload failed" });
    }
});
exports.uploadImages = uploadImages;
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const images = yield imageSvc.getUserImages(userId);
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ error: "Fetching images failed" });
    }
});
exports.getImages = getImages;
// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await imageSvc.deleteImage(id);
//     res.status(200).json({ message: "Image deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Image deletion failed" });
//   }
// };
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const image = yield imageSvc.getImageDoc(id);
        if (!image) {
            res.status(404).json({ message: "Image not found" });
            return;
        }
        const imagePath = path_1.default.join(__dirname, '../../', image.imageUrl);
        try {
            yield promises_1.default.unlink(imagePath);
        }
        catch (err) {
            console.error('Failed to delete the image file:', err);
            res.status(500).json({ message: "Failed to delete the image file" });
            return;
        }
        yield imageSvc.deleteImage(id);
        res.status(200).json({ message: "Image and file deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteImage = deleteImage;
const updateImageOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = req.body;
    try {
        yield imageSvc.reorderImages(images);
        res.status(200).json({ message: "Image order updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update image order" });
    }
});
exports.updateImageOrder = updateImageOrder;
const rearrangeImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = req.body;
        yield imageSvc.rearrangeImages(images);
        res.status(200).json({ message: "Images rearranged" });
    }
    catch (error) {
        res.status(500).json({ error: "Rearranging images failed" });
    }
});
exports.rearrangeImages = rearrangeImages;
const editImageTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title } = req.body;
    try {
        yield imageSvc.updateImageTitle(id, title);
        res.status(200).json({ message: "Image title updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update image title" });
    }
});
exports.editImageTitle = editImageTitle;
const editImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    try {
        const updatedImage = yield imageSvc.updateImageEdit(req.params.id, title, imageUrl);
        res.json(updatedImage);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update image" });
    }
});
exports.editImage = editImage;
