import { Socket } from "socket.io";
import http from "http";

import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/usermanager";


const app = express();
const server = http.createServer(http);

const io = new Server(server ,{
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on("userDetails", ({ name, id }) => {
    userManager.addUser(name, socket, id);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  })
});

server.listen(3001, () => {
    console.log('listening on :3001');
});