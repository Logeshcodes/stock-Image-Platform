import express from 'express';
import { register, login, requestPasswordReset, resetPasswordController } from '../controllers/authController';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/change-password',authMiddleware ,  resetPasswordController);

export default router;