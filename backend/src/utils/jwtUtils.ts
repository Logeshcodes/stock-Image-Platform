import jwt from 'jsonwebtoken';

export const generateJWT = (userId: string): string => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
};
