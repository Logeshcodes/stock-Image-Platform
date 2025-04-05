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
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageService = void 0;
const imageService = (imageRepo) => ({
    uploadImages: (images, userId, titles) => __awaiter(void 0, void 0, void 0, function* () {
        const maxOrderImage = yield imageRepo.findMaxOrderByUserId(userId);
        const startingOrder = maxOrderImage ? maxOrderImage.order + 1 : 1;
        const imagesWithUser = images.map((file, index) => ({
            title: titles,
            imageUrl: `/uploads/${file.filename}`,
            userId: userId,
            order: startingOrder + index,
        }));
        return yield imageRepo.saveImages(imagesWithUser);
    }),
    getUserImages: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield imageRepo.findImagesByUserId(userId);
    }),
    getImageDoc: (Id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield imageRepo.findImagesById(Id);
    }),
    deleteImage: (imageId) => __awaiter(void 0, void 0, void 0, function* () {
        yield imageRepo.removeImage(imageId);
    }),
    rearrangeImages: (images) => __awaiter(void 0, void 0, void 0, function* () {
        yield imageRepo.updateImageOrder(images);
    }),
    reorderImages: (images) => __awaiter(void 0, void 0, void 0, function* () {
        yield imageRepo.updateImagesOrder(images);
    }),
    updateImageTitle: (id, newTitle) => __awaiter(void 0, void 0, void 0, function* () {
        yield imageRepo.editImageTitleById(id, newTitle);
    }),
    updateImageEdit: (id, newTitle, url) => __awaiter(void 0, void 0, void 0, function* () {
        yield imageRepo.updateImage(id, newTitle, url);
    }),
});
exports.imageService = imageService;
