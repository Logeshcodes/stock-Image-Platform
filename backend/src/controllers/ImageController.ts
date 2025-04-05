import { Request, Response } from "express";
import { imageService } from "../services/ImageService";
import { imageRepository } from "../repositories/ImageRepository";
import path from "path";
import fs from 'fs/promises';

const imageSvc = imageService(imageRepository);

export const uploadImages = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const images = req.files as Express.Multer.File[];
    const { titles } = req.body;

    const uploadedImages = await imageSvc.uploadImages(images, userId, titles);

    res.status(201).json(uploadedImages);
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
};

export const getImages = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const images = await imageSvc.getUserImages(userId);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Fetching images failed" });
  }
};

// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await imageSvc.deleteImage(id);
//     res.status(200).json({ message: "Image deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Image deletion failed" });
//   }
// };

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const image: any = await imageSvc.getImageDoc(id); 

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    const imagePath = path.join(__dirname, '../../', image.imageUrl);
    
    try {
      await fs.unlink(imagePath); 
    } catch (err) {
      console.error('Failed to delete the image file:', err);
      res.status(500).json({ message: "Failed to delete the image file" });
      return;
    }
    
    await imageSvc.deleteImage(id); 
    res.status(200).json({ message: "Image and file deleted successfully" });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateImageOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const images = req.body;
  
  try {
    await imageSvc.reorderImages(images);
    res.status(200).json({ message: "Image order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update image order" });
  }
};

export const rearrangeImages = async (req: Request, res: Response) => {
  try {
    const images = req.body;
    await imageSvc.rearrangeImages(images);
    res.status(200).json({ message: "Images rearranged" });
  } catch (error) {
    res.status(500).json({ error: "Rearranging images failed" });
  }
};

export const editImageTitle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    await imageSvc.updateImageTitle(id, title);
    res.status(200).json({ message: "Image title updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update image title" });
  }
};

export const editImage = async (req: Request, res: Response) => {
  const { title } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const updatedImage = await imageSvc.updateImageEdit(req.params.id, title, imageUrl);
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: "Failed to update image" });
  }
}

