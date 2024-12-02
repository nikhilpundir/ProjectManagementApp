import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Task CRUD routes
router.post('/add', authenticate, authorize('TASK', 'CREATE'), createTask);
router.get('/', authenticate, authorize('TASK', 'READ'), getTasks);
router.put('/:taskId', authenticate, authorize('TASK', 'UPDATE'), updateTask);
router.delete('/:taskId', authenticate, authorize('TASK', 'DELETE'), deleteTask);

export default router;
