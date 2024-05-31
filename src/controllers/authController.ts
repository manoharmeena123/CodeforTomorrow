import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  if (user?.session) {
    res.clearCookie('token', { path: '/' });
  }

  const token = generateToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { session: token },
  });

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ message: 'Logged in successfully' });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = verifyToken(token);

    await prisma.user.update({
      where: { id: (decoded as any).userId },
      data: { session: null },
    });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
};
