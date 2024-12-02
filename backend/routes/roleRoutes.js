import express from 'express';
import { createRole, getAllRoles } from '../controllers/roleController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',authenticate, authorize('ROLE', 'CREATE'), createRole);
router.get('/',authenticate, authorize('ROLE', 'READ'),getAllRoles)
export default router;
