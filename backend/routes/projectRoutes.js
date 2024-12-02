import express from 'express';
import { createProject,getAllProjects } from '../controllers/projectController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Check if user has "CREATE" action permission for "Project" resource
router.post('/add', authenticate, authorize('PROJECT', 'CREATE'), createProject);
router.get('/', authenticate, authorize('PROJECT', 'READ'), getAllProjects);
export default router;
