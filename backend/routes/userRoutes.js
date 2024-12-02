import express from 'express';
import { loginUser, registerUser,getAllUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register',authenticate, authorize('USER', 'CREATE'),registerUser);
router.post('/login', loginUser);
router.get('/',authenticate, authorize('USER', 'READ'), getAllUsers);
export default router;
