import { ClassEntity } from "../../entities/class";

export interface IClassRepository {
  findAllGrades(): Promise<{ grade: string }[]>;
  findByNameAndSection(name: string, section: string): Promise<ClassEntity | null>;
  create(classData: Partial<ClassEntity>): Promise<ClassEntity>;
  findAll(page: number, limit: number): Promise<{ data: ClassEntity[]; totalCount: number }>;
  findByName(name: string): Promise<ClassEntity | null>;
  findById(id: string): Promise<ClassEntity | null>;
  findByGrade(grade: string): Promise<ClassEntity[]>;
  update(classId: string, classData: Partial<ClassEntity>): Promise<ClassEntity>;
  fetchClass(): Promise<{ _id: string; name: string }[]>;
}