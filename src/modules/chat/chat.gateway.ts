import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<number, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // Xóa socket khỏi map khi client ngắt kết nối
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: number) {
    // Lưu socket của user
    this.userSockets.set(userId, client);
    console.log(`User ${userId} joined`);
    console.log('Current connected users:', Array.from(this.userSockets.keys()));
  }

  // Gửi tin nhắn đến một user cụ thể
  sendMessageToUser(userId: number, message: any) {
    console.log('Attempting to send message to user:', userId);
    console.log('Available sockets:', Array.from(this.userSockets.keys()));

    const socket = this.userSockets.get(userId);
    if (socket) {
      console.log('Found socket for user, sending message');
      socket.emit('newMessage', message);
    } else {
      console.log('No socket found for user:', userId);
    }
  }

  // Gửi tin nhắn đến một chatbox cụ thể
  sendMessageToChatbox(chatboxId: number, message: any) {
    console.log('Sending message to chatbox:', chatboxId);
    this.server.to(`chatbox_${chatboxId}`).emit('newMessage', message);
  }
}
