import xlsx from '@e965/xlsx';
import { IExcelParser } from '../../domain/interface/IExcelParser.js';
import { Student } from '../../domain/entities/student.js';

interface StudentExcelRow {
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: 'Male' | 'Female';
  age: number;
  className?: string;
  subjectIds?: string;
  password?: string;
  profileImage?: string;
  houseName?: string;
  place?: string;
  district?: string;
  pincode?: number;
  phoneNo?: number;
  guardianName?: string;
  guardianContact?: string;
}

export class StudentExcelParser implements IExcelParser<Student> {
  parse(buffer: Buffer): Student[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets['Students'];
    if (!sheet) throw new Error('No "Students" sheet found');

    const data: StudentExcelRow[] =
      xlsx.utils.sheet_to_json<StudentExcelRow>(sheet);
    console.log('Parsed Excel Data:', data);

    return data.map(
      (s) =>
        new Student({
          name: s.name,
          email: s.email,
          roleNumber: s.roleNumber,
          dob: s.dob,
          gender: s.gender,
          age: s.age,
          class: s.className || null,
          subjectIds: s.subjectIds ? s.subjectIds.split(',') : [],
          password: s.password || 'defaultPassword123',
          profileImage: s.profileImage || '',
          address: {
            houseName: s.houseName || '',
            place: s.place || '',
            district: s.district || '',
            pincode: s.pincode || 0,
            phoneNo: s.phoneNo || 0,
            guardianName: s.guardianName || '',
            guardianContact: s.guardianContact || null,
          },
        })
    );
  }
}
