import express from 'express';
import { register, login, resetPasswordController } from '../controllers/authController';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/change-password',authMiddleware ,  resetPasswordController);

export default router;