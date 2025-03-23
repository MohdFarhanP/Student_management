import XLSX from '@e965/xlsx';
import { IExcelParser } from '../../domain/interface/IExcelParser.js';
import { Teacher } from '../../domain/entities/teacher.js';

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
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<TeacherExcelRow>(sheet);

    return data.map((t) => {
      return new Teacher({
        name: t.name,
        email: t.email,
        empId: t.empId,
        gender: t.gender,
        phoneNo: t.phoneNo,
        dateOfBirth: t.dateOfBirth,
        assignedClass: t.assignedClass,
        subject: t.subject,
        password: 'defaultPassword123',
        profileImage: '',
        specialization: '',
        experienceYears: 0,
        qualification: '',
      });
    });
  }
}
