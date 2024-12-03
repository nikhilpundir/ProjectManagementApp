import express from 'express';
import { loginUser, registerUser,getAllUsers, logoutUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register',authenticate, authorize('USER', 'CREATE'),registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/',authenticate, authorize('USER', 'READ'), getAllUsers);
export default router;
