export interface IDeleteSubjectUseCase {
    execute(classGrade: string, subjectId: string): Promise<string>;
  }