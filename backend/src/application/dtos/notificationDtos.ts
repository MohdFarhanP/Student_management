import { RecipientType, Role } from '../../domain/types/enums';

export interface SendNotificationDTO {
  title: string;
  message: string;
  recipientType: RecipientType;
  recipientIds?: string[];
  senderId: string;
  senderRole: Role;
  scheduledAt?: Date;
}
