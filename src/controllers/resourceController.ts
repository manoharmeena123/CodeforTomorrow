import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import redis from '../utils/redis';
import { Server } from 'socket.io';
import { Resource } from '../models/resource';

let io: Server;

export const setSocketServerInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getResources = async (req: Request, res: Response) => {
  const cachedResources = await redis.get('resources');
  if (cachedResources) {
    return res.json(JSON.parse(cachedResources));
  }

  const resources: Resource[] = await prisma.resource.findMany();
  await redis.set('resources', JSON.stringify(resources), { EX: 60 });
  res.json(resources);
};

export const createResource = async (req: Request, res: Response) => {
  const { name } = req.body;
  const resource: Resource = await prisma.resource.create({
    data: { name },
  });

  await redis.del('resources');
  io.emit('resourceUpdated', resource);
  res.status(201).json(resource);
};
