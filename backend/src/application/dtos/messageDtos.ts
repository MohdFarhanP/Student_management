import { MediaType, Role } from '../../domain/types/enums';

export interface SendMessageDTO {
  chatRoomId: string;
  senderId: string;
  senderRole: Role;
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}
