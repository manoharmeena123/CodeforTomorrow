import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = verifyToken(token);
    (req as any).userId = (decoded as any).userId;
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }
};
