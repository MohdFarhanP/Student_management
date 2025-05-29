import { SubjectEntity } from '../../../../domain/entities/subject';
import { mapSubjectName } from './enumMappers';

export function mapToSubjectEntity(subject: any): SubjectEntity {
  const teacherNames = Array.isArray(subject.teachers)
    ? subject.teachers.map((teacher: any) => teacher.name)
    : [];

  return SubjectEntity.create({
    id: subject._id.toString(),
    subjectName: mapSubjectName(subject.subjectName),
    teachers: teacherNames,
    notes: subject.notes,
  });
}
