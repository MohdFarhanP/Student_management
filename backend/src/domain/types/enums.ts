export enum Role {
  Admin = 'Admin',
  Student = 'Student',
  Teacher = 'Teacher',
}

export enum MediaType {
  Image = 'image',
  Document = 'document',
}

export enum RecipientType {
  Global = 'global',
  Role = 'role',
  Student = 'Student',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
}
export enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
}

export enum Grade {
  Grade1 = '1',
  Grade2 = '2',
  Grade3 = '3',
  Grade4 = '4',
  Grade5 = '5',
  Grade6 = '6',
  Grade7 = '7',
  Grade8 = '8',
  Grade9 = '9',
  Grade10 = '10',
  Grade11 = '11',
  Grade12 = '12',
}

export enum Section {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum SubjectName {
  Malayalam = 'Malayalam',
  Tamil = 'Tamil',
  Kannada = 'Kannada',
  Urdu = 'Urdu',
  Sanskrit = 'Sanskrit',
  Arabic = 'Arabic',
  Hindi = 'Hindi',
  English = 'English',
  Math = 'Math',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology',
  Science = 'Science',
  History = 'History',
  Geography = 'Geography',
  Economics = 'Economics',
  ComputerScience = 'ComputerScience',
  Literature = 'Literature',
  GeneralKnowledge = 'GeneralKnowledge',
}

export enum FileType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
}

export enum SessionStatus {
  Scheduled = 'SCHEDULED',
  Ongoing = 'ONGOING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Ended = 'ENDED',
}

export enum ParticipantRole {
  Teacher = 'TEACHER',
  Student = 'STUDENT',
}

export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
