import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    phoneNumber : number ;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
