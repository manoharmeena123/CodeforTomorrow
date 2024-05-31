import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout } from '../controllers/authController';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);

router.post('/login', login);
router.post('/logout', logout);

export default router;
