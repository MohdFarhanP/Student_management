import xlsx from '@e965/xlsx';

export class ExcelParser {
  static parse(filePath: string) {
    const workbook = xlsx.readFile(filePath);
    const studentsSheet = workbook.Sheets['Students'];
    const teachersSheet = workbook.Sheets['Teachers'];

    if (!studentsSheet || !teachersSheet) {
      throw new Error(
        'Excel file must contain "Students" and "Teachers" sheets'
      );
    }

    return {
      studentsData: xlsx.utils.sheet_to_json(studentsSheet),
      teachersData: xlsx.utils.sheet_to_json(teachersSheet),
    };
  }
}
