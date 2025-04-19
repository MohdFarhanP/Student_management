import { IExcelParser } from '../../domain/interface/admin/IExcelParser';
import { Student } from '../../domain/entities/student';
import XLSX from '@e965/xlsx';

interface StudentExcelRow {
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: 'Male' | 'Female';
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
    const rows = XLSX.utils.sheet_to_json(sheet) as StudentExcelRow[];

    return rows.map((row) => {
      const typedRow = row as StudentExcelRow;
      return new Student({
        name: typedRow.name,
        email: typedRow.email,
        roleNumber: typedRow.roleNumber,
        dob: typedRow.dob,
        gender: typedRow.gender,
        age: typedRow.age,
        class: typedRow.class || null,
        password: typedRow.password || 'defaultPassword',
        profileImage: typedRow.profileImage || '',
        address: {
          houseName: typedRow.houseName || '',
          place: typedRow.place || '',
          district: typedRow.district || '',
          pincode: typedRow.pincode || 0,
          phoneNo: typedRow.phoneNo || 0,
          guardianName: typedRow.guardianName || '',
          guardianContact: typedRow.guardianContact || null,
        },
      });
    });
  }
}
