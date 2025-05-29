import {
  Day,
  Grade,
  LeaveStatus,
  MediaType,
  RecipientType,
  Role,
  Section,
  SessionStatus,
  SubjectName,
} from '../../../../domain/types/enums';

export function mapRecipientType(value: string): RecipientType {
  if (Object.values(RecipientType).includes(value as RecipientType)) {
    return value as RecipientType;
  }
  throw new Error(`Invalid RecipientType: ${value}`);
}

export function mapRole(value: string): Role {
  if (Object.values(Role).includes(value as Role)) {
    return value as Role;
  }
  throw new Error(`Invalid Role: ${value}`);
}

export function mapMediaType(value?: string): MediaType | undefined {
  if (!value) return undefined;
  if (Object.values(MediaType).includes(value as MediaType)) {
    return value as MediaType;
  }
  throw new Error(`Invalid MediaType: ${value}`);
}

export function mapSessionStatus(value: string): SessionStatus {
  if (Object.values(SessionStatus).includes(value as SessionStatus)) {
    return value as SessionStatus;
  }
  throw new Error(`Invalid SessionStatus: ${value}`);
}

export function mapSubjectName(value: string): SubjectName {
  if (Object.values(SubjectName).includes(value as SubjectName)) {
    return value as SubjectName;
  }
  throw new Error(`Invalid SessionStatus: ${value}`);
}

export function mapSection(value: string): Section {
  if (Object.values(Section).includes(value as Section)) {
    return value as Section;
  }
  throw new Error(`Invalid section value: ${value}`);
}

export function mapGrade(value: string): Grade {
  if (Object.values(Grade).includes(value as Grade)) {
    return value as Grade;
  }
  throw new Error(`Invalid grade value: ${value}`);
}

export function mapLeaveStatus(value: string): LeaveStatus {
  if (Object.values(LeaveStatus).includes(value as LeaveStatus)) {
    return value as LeaveStatus;
  }
  throw new Error(`Invalid leaveStatus value: ${value}`);
}

export function mapAvailability(value: any): { [key in Day]: number[] } {
  const availability: { [key in Day]: number[] } = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };

  for (const key of Object.keys(value)) {
    if (!Object.values(Day).includes(key as Day)) {
      throw new Error(`Invalid day in availability: ${key}`);
    }

    const periods = value[key];
    if (
      !Array.isArray(periods) ||
      !periods.every((n) => typeof n === 'number')
    ) {
      throw new Error(`Invalid periods for ${key}, expected array of numbers.`);
    }

    availability[key as Day] = periods;
  }

  return availability;
}
