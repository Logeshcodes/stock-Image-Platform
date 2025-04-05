import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  userId: string;
  title: string;
  imageUrl: string;
  order: number;
}

const ImageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, required: true },
});

export const Image = mongoose.model<IImage>("Image", ImageSchema);
