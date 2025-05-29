import { LiveSession } from '../../../../domain/entities/Livesession';
import { ILiveSessionModel } from '../interface/ILiveSessionModel';
import { mapSessionStatus } from './enumMappers';

export function mapToLiveSessionEntity(doc: ILiveSessionModel): LiveSession {
  return new LiveSession(
    doc.id,
    doc.title,
    doc.classId,
    doc.teacherId,
    doc.studentIds,
    doc.scheduledAt,
    mapSessionStatus(doc.status),
    doc.roomId,
    doc.token,
    doc.participants,
    doc.createdAt,
    doc.updatedAt
  );
}
