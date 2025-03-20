export interface IExcelParser<T> {
  parse(fileBuffer: Buffer): T[];
}
