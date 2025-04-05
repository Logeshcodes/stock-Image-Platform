import { Image, IImage } from "../models/Image";

export const imageRepository = {
  saveImages: async (images: any): Promise<IImage[]> => {
    return (await Image.insertMany(images)).map((image) => image.toObject() as IImage); 
  },
  findMaxOrderByUserId: async (userId: string): Promise<IImage | null> => {
    return await Image.findOne({ userId }).sort({ order: -1 });
  },

  findImagesByUserId: async (userId: string): Promise<IImage[]> => {
    return Image.find({ userId }).sort({ order: 1 }).lean<IImage[]>().exec(); 
  },

  findImagesById: async (Id: string): Promise<IImage[] | null> => {
    return await Image.findById(Id);
  },

  removeImage: async (imageId: string): Promise<void> => {
    await Image.findByIdAndDelete(imageId);
  },

  updateImageOrder: async (images: IImage[]): Promise<void> => {
    for (const image of images) {
      await Image.findByIdAndUpdate(image._id, { order: image.order }).exec();
    }
  },
  updateImagesOrder: async (images: IImage[]): Promise<void> => {
    const bulkOps = images.map((image) => ({
      updateOne: {
        filter: { _id: image._id },
        update: { $set: { order: image.order } },
      },
    }));
    
    await Image.bulkWrite(bulkOps);
  },
  editImageTitleById: async (id: string, newTitle: string): Promise<void> => {
    await Image.findByIdAndUpdate(id, { title: newTitle }, { new: true });
  },
  updateImage: async (id: string, title: string, imageUrl?: string): Promise<void> => {
    const updatedData: any = { title };
    if (imageUrl) updatedData.imageUrl = imageUrl;
    await Image.findByIdAndUpdate(id, updatedData, { new: true });
  },
};
