// import { SubjectRepository } from '../../../infrastructure/repositories/subjectRepository.js';
// import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

// export class DeleteSubjectUseCase {
//   constructor(
//     private subjectRepository: SubjectRepository,
//     private classRepository: ClassRepository
//   ) {}

//   async execute(classId: string, subjectId: string) {
//     const existingClass = await this.classRepository.findById(classId);
//     if (!existingClass || !existingClass.subjects.includes(subjectId)) {
//       throw new Error('Subject not found in the specified class');
//     }

//     await this.subjectRepository.delete(subjectId);

//     // Remove the subject reference from the class
//     existingClass.subjects = existingClass.subjects.filter(
//       (id) => id.toString() !== subjectId
//     );
//     await this.classRepository.update(classId, {
//       subjects: existingClass.subjects,
//     });

//     return { message: 'Subject deleted successfully' };
//   }
// }
