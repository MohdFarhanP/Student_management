import { Server as SocketIOServer, Socket } from 'socket.io';
import { SendMessage } from '../../application/useCases/message/sendMessage.js';
import { MessageRepository } from '../repositories/message/messageRepository.js';

export interface SendMessageDTO {
  chatRoomId: string;
  senderId: string;
  senderRole: 'student' | 'teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
}

export class SocketServer {
  constructor(private io: SocketIOServer) {}

  initialize() {
    const sendMessageUseCase = new SendMessage(new MessageRepository());
    const messageRepository = new MessageRepository();

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      socket.on('joinRoom', (chatRoomId: string) => {
        if (!chatRoomId) {
          socket.emit('error', 'Invalid chatRoomId');
          return;
        }
        socket.join(chatRoomId);
        console.log(`User ${socket.id} joined room ${chatRoomId}`);
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
          if (!message.chatRoomId || !message.senderId || !message.senderRole) {
            socket.emit('error', 'Missing required message fields');
            return;
          }
          const savedMessage = await sendMessageUseCase.execute(message);
          this.io.to(message.chatRoomId).emit('message', savedMessage);
        } catch (error) {
          if (error instanceof Error) {
            socket.emit('error', error.message);
          } else {
            socket.emit('error', 'An unknown error occurred');
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
}
