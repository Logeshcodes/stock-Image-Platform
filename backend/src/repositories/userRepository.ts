import { User, IUser } from '../models/userModel';
import jwt from "jsonwebtoken";

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
};


export const getUser = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId);
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
    const user = new User(userData);
    return user.save();
};

export const findUserByResetToken = async (token: string): Promise<IUser | null> => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const userId = (decoded as any)._id;
    return User.findById(userId);
};

export const updateUser = async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, updates, { new: true });
};
