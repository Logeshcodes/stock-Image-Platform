import { IImage } from "../models/Image";
import { imageRepository } from "../repositories/ImageRepository";

export const imageService = (imageRepo: typeof imageRepository) => ({
  uploadImages: async (images: any[], userId: string, titles: any[]) => {
    const maxOrderImage = await imageRepo.findMaxOrderByUserId(userId);
    const startingOrder = maxOrderImage ? maxOrderImage.order + 1 : 1;
    
    const imagesWithUser = images.map((file, index) => ({
      title: titles,
      imageUrl: `/uploads/${file.filename}`,
      userId: userId,
      order: startingOrder + index,
    }));

    return await imageRepo.saveImages(imagesWithUser);
  },

  getUserImages: async (userId: string) => {
    return await imageRepo.findImagesByUserId(userId);
  },

  getImageDoc: async (Id: string) => {
    return await imageRepo.findImagesById(Id);
  },

  deleteImage: async (imageId: string) => {
    await imageRepo.removeImage(imageId);
  },

  rearrangeImages: async (images: any[]) => {
    await imageRepo.updateImageOrder(images);
  },
  reorderImages: async (images: IImage[]): Promise<void> => {
    await imageRepo.updateImagesOrder(images);
  },
  updateImageTitle: async (id: string, newTitle: string): Promise<void> => {
    await imageRepo.editImageTitleById(id, newTitle);
  },
  updateImageEdit: async (id: string, newTitle: string, url?: string): Promise<void> => {
    await imageRepo.updateImage(id, newTitle, url);
  },
  
});
