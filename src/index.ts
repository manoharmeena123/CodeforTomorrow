import express from "express";
import cookieParser from "cookie-parser";
import "reflect-metadata"; // For TypeORM
import { createServer } from "http";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resource";
import { setSocketServerInstance } from "./controllers/resourceController";
import { initSocketServer } from "./sockets/socket";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

//Route
app.use("/auth", authRoutes);
app.use("/resource", resourceRoutes);

//Socket
export const server = createServer(app);
const io = initSocketServer(server);

setSocketServerInstance(io);


//==========================Server===================================>
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
