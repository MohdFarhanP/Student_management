export interface ISubject extends Document {
  id: string;
  subjectName: string;
  teachers: string[];
  notes: string[];
}
