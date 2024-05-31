import { Router } from 'express';
import { getResources, createResource } from '../controllers/resourceController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/get', authMiddleware, getResources);
router.post('/create', authMiddleware, createResource);

export default router;
