import xlsx from '@e965/xlsx';
import { IExcelParser } from '../../domain/interface/IExcelParser.js';
import { Teacher } from '../../domain/entities/teacher.js';
import mongoose from 'mongoose';

interface TeacherExcelRow {
  name: string;
  subject: string;
  email: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass: string;
  dateOfBirth: string;
}

export class TeacherExcelParser implements IExcelParser<Teacher> {
  parse(buffer: Buffer): Teacher[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    console.log('Available sheets:', workbook.SheetNames);

    const sheet = workbook.Sheets['Teachers'];
    if (!sheet) throw new Error('No "Teachers" sheet found');

    const data: TeacherExcelRow[] =
      xlsx.utils.sheet_to_json<TeacherExcelRow>(sheet);
    console.log('Parsed Excel Data:', data);

    return data.map((t) => {
      return new Teacher({
        name: t.name,
        email: t.email,
        empId: t.empId,
        gender: t.gender,
        phoneNo: t.phoneNo,
        dateOfBirth: t.dateOfBirth,
        assignedClass: new mongoose.Types.ObjectId(t.assignedClass),
        subject: new mongoose.Types.ObjectId(t.subject),
        password: 'defaultPassword123',
        profileImage: '',
        specialization: '',
        experienceYears: 0,
        qualification: '',
      });
    });
  }
}
