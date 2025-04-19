import axios from 'axios';
import { Message } from '../types/message';

export class ApiAdapter {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getMessages(chatRoomId: string): Promise<Message[]> {
    const response = await axios.get(
      `${this.apiUrl}/chat/messages/${chatRoomId}`
    );
    return response.data;
  }
}
