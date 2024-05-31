import { Server } from "socket.io";

let io: Server;

export const initSocketServer = (server: any) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (msg) => {
      io.emit("message", msg);
    });

    socket.on("resourceUpdated", (resource) => {
      io.emit("resourceUpdated", resource);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

export const getSocketServerInstance = () => io;
