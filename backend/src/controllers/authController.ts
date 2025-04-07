import { Request, Response } from 'express';
import { registerUser, loginUser, resetPassword , getUserPassword } from '../services/authService';
import { ResponseError } from '../utils/constants';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, username,phoneNumber ,  password } = req.body;
        console.log("auth controller : " , email, username,phoneNumber ,  password );
        
        const token = await registerUser(email, username,phoneNumber ,  password);
        res.status(201).json({ token ,
            success: true,
            message: ResponseError.SIGNUP_SUCCESS,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token ,
            success: true,
            message: ResponseError.ACCOUNT_LOGIN_SUCCESS,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { currentPassword ,  newPassword } = req.body;
        const userId = (req as any).userId;

        console.log("password data : " , userId ,currentPassword ,  newPassword );

        const user = await getUserPassword(userId);
        const oldPassword = user?.password ;

        console.log("oldPassword : " ,oldPassword)

        const result = await bcrypt.compare(currentPassword,oldPassword! );

        if(result){
            const response = await resetPassword(userId, newPassword);

            if(response){
                res.status(200).json({ success : true , message:ResponseError.RESET_PASSWORD_SUCCESS });
            }else{
                res.json({
                    success: false,
                    message: ResponseError.PASSWORD_NOT_UPDATED,
                  });
            }    
        }else{
            res.json({
                success: false,
                message: ResponseError.PASSWORD_WRONG,
              });
        }

        
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
