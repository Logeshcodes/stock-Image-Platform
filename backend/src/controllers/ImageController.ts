import { Request, Response } from "express";
import { imageService } from "../services/ImageService";
import { imageRepository } from "../repositories/ImageRepository";
import path from "path";
import fs from 'fs/promises';
import { ResponseError } from "../utils/constants";

const imageSvc = imageService(imageRepository);

export const uploadImages = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const images = req.files as Express.Multer.File[];
    const { titles } = req.body;

    const uploadedImages = await imageSvc.uploadImages(images, userId, titles);

    res.status(201).json({uploadedImages  , 
      success: true ,
      message: ResponseError.IMAGE_UPLOADED_SUCCESS,} );
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: ResponseError.IMAGE_UPLOAD_FAILED,
      });
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


export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const image: any = await imageSvc.getImageDoc(id); 

    if (!image) {
      res.status(404).json({ message: ResponseError.IMAGE_NOTFOUND });
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
    res.status(200).json({ success : true , message: ResponseError.IMAGE_DELETED_SUCCESS });

  } catch (error) {
    res.status(500).json({ message: ResponseError.INTERNAL_RESPONSE_ERROR });
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
    res.status(200).json({ message: ResponseError.IMAGE_EDITED });
  } catch (error) {
    res.status(500).json({ message: ResponseError.INTERNAL_RESPONSE_ERROR });
  }
};

export const editImage = async (req: Request, res: Response) => {
  const { title } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const updatedImage = await imageSvc.updateImageEdit(req.params.id, title, imageUrl);
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: ResponseError.INTERNAL_RESPONSE_ERROR });
  }
}

