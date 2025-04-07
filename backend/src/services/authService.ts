import { findUserByEmail, createUser, findUserByResetToken, updateUser , getUser } from '../repositories/userRepository';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { generateJWT } from '../utils/jwtUtils';


export const registerUser = async (email: string, username: string, phoneNumber : number ,  password: string) => {

    console.log("first")
    const existingUser = await findUserByEmail(email);
    console.log("first ," , existingUser);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await hashPassword(password);
    const newUser: any = await createUser({ email, username, phoneNumber , password: hashedPassword });

    console.log("newUser" , newUser);

    return generateJWT(newUser._id);
};

export const loginUser = async (email: string, password: string) => {
    const user: any = await findUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
        throw new Error('Invalid email or password');
    }
    return generateJWT(user._id);
};



export const getUserPassword = async(userId : string) =>{
    return await getUser(userId);
}

export const resetPassword = async (userId: string, newPassword: string) => {

    const hashedPassword = await hashPassword(newPassword);
    return await updateUser(userId, {password: hashedPassword});
};
