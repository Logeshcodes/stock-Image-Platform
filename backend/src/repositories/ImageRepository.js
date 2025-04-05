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
exports.imageRepository = void 0;
const Image_1 = require("../models/Image");
exports.imageRepository = {
    saveImages: (images) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield Image_1.Image.insertMany(images)).map((image) => image.toObject());
    }),
    findMaxOrderByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Image_1.Image.findOne({ userId }).sort({ order: -1 });
    }),
    findImagesByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return Image_1.Image.find({ userId }).sort({ order: 1 }).lean().exec();
    }),
    findImagesById: (Id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Image_1.Image.findById(Id);
    }),
    removeImage: (imageId) => __awaiter(void 0, void 0, void 0, function* () {
        yield Image_1.Image.findByIdAndDelete(imageId);
    }),
    updateImageOrder: (images) => __awaiter(void 0, void 0, void 0, function* () {
        for (const image of images) {
            yield Image_1.Image.findByIdAndUpdate(image._id, { order: image.order }).exec();
        }
    }),
    updateImagesOrder: (images) => __awaiter(void 0, void 0, void 0, function* () {
        const bulkOps = images.map((image) => ({
            updateOne: {
                filter: { _id: image._id },
                update: { $set: { order: image.order } },
            },
        }));
        yield Image_1.Image.bulkWrite(bulkOps);
    }),
    editImageTitleById: (id, newTitle) => __awaiter(void 0, void 0, void 0, function* () {
        yield Image_1.Image.findByIdAndUpdate(id, { title: newTitle }, { new: true });
    }),
    updateImage: (id, title, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = { title };
        if (imageUrl)
            updatedData.imageUrl = imageUrl;
        yield Image_1.Image.findByIdAndUpdate(id, updatedData, { new: true });
    }),
};
