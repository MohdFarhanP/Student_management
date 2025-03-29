// import { SubjectRepository } from '../../../infrastructure/repositories/subjectRepository.js';
// import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

// export class UpdateSubjectUseCase {
//   constructor(
//     private subjectRepository: SubjectRepository,
//     private classRepository: ClassRepository
//   ) {}

//   async execute(classId: string, subjectId: string, updatedData: Partial<any>) {
//     const existingClass = await this.classRepository.findById(classId);
//     if (!existingClass || !existingClass.subjects.includes(subjectId)) {
//       throw new Error('Subject not found in the specified class');
//     }

//     return await this.subjectRepository.update(subjectId, updatedData);
//   }
// }
