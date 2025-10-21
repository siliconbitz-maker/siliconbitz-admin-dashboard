import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.on('connection', socket => {
  console.log('⚡ Socket connected:', socket.id);

  // Join a room (room name or userId)
  socket.on('join-room', (room: string) => {
    socket.join(room);
  });

  // Send a message
  socket.on(
    'send-message',
    async ({ content, receiverId, room, senderId }: { content: string; receiverId?: string; room?: string; senderId: string }) => {
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId: receiverId || senderId,
          room: room || null,
        },
        include: { sender: { select: { name: true } } },
      });

      if (room) io.to(room).emit('new-message', message);
      else {
        if (receiverId) io.to(receiverId).emit('new-message', message);
        io.to(senderId).emit('new-message', message);
      }
    }
  );

  // Register user for private messages
  socket.on('register-user', (userId: string) => {
    socket.join(userId);
  });
});

httpServer.listen(3001, () => {
  console.log('🚀 Socket.IO server running on port 3001');
});
