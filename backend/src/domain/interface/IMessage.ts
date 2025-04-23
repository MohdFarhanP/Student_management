// domain/interface/IMessage.ts
import { Role, MediaType } from "../types/enums";

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: Role;
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  createdAt: Date;
}