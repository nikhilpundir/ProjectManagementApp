import express from 'express';
import { verifyUser } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/verify', authenticate,verifyUser);
export default router;
