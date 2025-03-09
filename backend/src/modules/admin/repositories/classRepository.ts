import mongoose from "mongoose";
import { ClassEntity } from "../entities/class";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true },
  teachers: { type: [String], required: true },
  timetable: { type: String, required: true },
  students: { type: [String], required: true },
  totalStudents: { type: Number, required: true },
  tutor: { type: String, required: true },
  roomNo: { type: String, required: true },
  subjects: { type: [String], required: true },
  grade: { type: String, required: true },
});

const ClassModel = mongoose.model("Class", ClassSchema);

export class ClassRepository {
  async create(classData: ClassEntity): Promise<ClassEntity> {
    const newClass = await ClassModel.create(classData);
    return ClassEntity.create(
      newClass.id,
      newClass.name,
      newClass.section,
      newClass.teachers,
      newClass.timetable,
      newClass.students,
      newClass.totalStudents,
      newClass.tutor,
      newClass.roomNo,
      newClass.subjects,
      newClass.grade
    );
  }

  async findAll(): Promise<ClassEntity[]> {
    const classes = await ClassModel.find();
    return classes.map((c) =>
      ClassEntity.create(
        c.id,
        c.name,
        c.section,
        c.teachers,
        c.timetable,
        c.students,
        c.totalStudents,
        c.tutor,
        c.roomNo,
        c.subjects,
        c.grade
      )
    );
  }

  async findById(id: string): Promise<ClassEntity | null> {
    const classData = await ClassModel.findById(id);
    if (!classData) return null;
    return ClassEntity.create(
      classData.id,
      classData.name,
      classData.section,
      classData.teachers,
      classData.timetable,
      classData.students,
      classData.totalStudents,
      classData.tutor,
      classData.roomNo,
      classData.subjects,
      classData.grade
    );
  }

  async update(id: string, classData: Partial<ClassEntity>): Promise<ClassEntity | null> {
    const updatedClass = await ClassModel.findByIdAndUpdate(id, classData, { new: true });
    if (!updatedClass) return null;
    return ClassEntity.create(
      updatedClass.id,
      updatedClass.name,
      updatedClass.section,
      updatedClass.teachers,
      updatedClass.timetable,
      updatedClass.students,
      updatedClass.totalStudents,
      updatedClass.tutor,
      updatedClass.roomNo,
      updatedClass.subjects,
      updatedClass.grade
    );
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ClassModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
