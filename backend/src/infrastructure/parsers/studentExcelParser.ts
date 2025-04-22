import { IExcelParser } from '../../domain/interface/admin/IExcelParser';
import { Student } from '../../domain/entities/student';
import XLSX from '@e965/xlsx';
import { Gender } from '../../domain/types/enums';

interface StudentExcelRow {
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: Gender;
  age: number;
  class?: string;
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
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<StudentExcelRow>(sheet);

    return rows.map((row) => {
      return new Student({
        name: row.name,
        email: row.email,
        roleNumber: row.roleNumber,
        dob: row.dob,
        gender: row.gender,
        age: row.age,
        class: row.class || null,
        password: row.password || 'defaultPassword',
        profileImage: row.profileImage || '',
        address: {
          houseName: row.houseName || '',
          place: row.place || '',
          district: row.district || '',
          pincode: row.pincode || 0,
          phoneNo: row.phoneNo || 0,
          guardianName: row.guardianName || '',
          guardianContact: row.guardianContact ?? null,
        },
      });
    });
  }
}