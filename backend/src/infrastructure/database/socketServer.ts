import { Server as SocketIOServer, Socket } from 'socket.io';
import { SendMessage } from '../../application/useCases/message/sendMessage.js';
import { MessageRepository } from '../repositories/message/messageRepository.js';

export interface SendMessageDTO {
  chatRoomId: string;
  senderId: string;
  senderRole: 'Student' | 'Teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
}

export class SocketServer {
  constructor(private io: SocketIOServer) {}

  initialize() {
    const sendMessageUseCase = new SendMessage(new MessageRepository());
    const messageRepository = new MessageRepository();

    // Socket authentication middleware
    this.io.use((socket, next) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        return next(new Error('Authentication error: userId required'));
      }
      socket.data.userId = userId;
      next();
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id, 'userId:', socket.data.userId);

      socket.on('joinRoom', (chatRoomId: string, callback) => {
        if (!chatRoomId) {
          socket.emit('error', 'Invalid chatRoomId');
          return;
        }
        socket.join(chatRoomId);
        console.log(`User ${socket.data.userId} joined room ${chatRoomId}`);
        if (callback) callback();
      });

      socket.on('loadMessages', async (chatRoomId: string) => {
        try {
          const messages = await messageRepository.findByChatRoomId(chatRoomId);
          socket.emit('initialMessages', messages);
        } catch (error) {
          socket.emit('error', 'Failed to load messages');
        }
      });

      socket.on('sendMessage', async (message: SendMessageDTO) => {
        try {
          if (
            !message.chatRoomId ||
            !message.senderId ||
            !message.senderRole ||
            message.senderId !== socket.data.userId
          ) {
            socket.emit('error', 'Unauthorized or missing message fields');
            return;
          }
          const savedMessage = await sendMessageUseCase.execute(message);
          // Broadcast to room, excluding sender
          socket.to(message.chatRoomId).emit('message', savedMessage);
          // Confirm to sender
          socket.emit('message', savedMessage);
        } catch (error) {
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'An unknown error occurred'
          );
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
}
