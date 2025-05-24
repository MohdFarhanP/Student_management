import { apiRequest } from '../apiClient';

const ADMIN_STUDENT_API_URL = '/admin/students';

interface Adresss {
  houseName?: string;
  place?: string;
  district?: string;
  pincode?: string | number;
  phoneNo?: string | number;
  guardianName?: string;
  guardianContact?: string | null | undefined;
}

export interface IStudent {
  id: string;
  roleNumber: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  dob?: string;
  class?: string;
  subjectIds?: string[];
  profileImage?: string;
  address?: Adresss;
}
export interface RecurringFee {
  id: string;
  title: string;
  amount: number;
  startMonth: string;
  endMonth?: string;
  classId: string;
  className?: string;
  recurring: boolean;
}

export interface StudentFeeDue {
  id: string;
  studentId: string;
  feeTitle: string;
  month: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
  paymentId?: string;
}

interface StudentsResponse {
  students: IStudent[];
  totalCount: number;
}
export interface ILiveSessions {
  title: string;
  time: string;
  isOngoing: boolean;
  joinLink?: string; // not implemented yet
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export const getStudents = async (page: number, limit: number): Promise<StudentsResponse> => {
  const res = await apiRequest<ApiResponse<StudentsResponse>>(
    'get',
    `${ADMIN_STUDENT_API_URL}/students`,
    undefined,
    { params: { page, limit } }
  );

  if (!res.data) {
    return { students: [], totalCount: 0 };
  }

  return res.data;
};

export const getStdLiveSessions = (id: string) =>
  apiRequest<ApiResponse<ILiveSessions[]>>('get', `${ADMIN_STUDENT_API_URL}/sessions/${id}`)
    .then((res)=> res.data);
    

export const addStudent = (data: Partial<IStudent>) =>
  apiRequest<ApiResponse<IStudent>, Partial<IStudent>>(
    'post',
    `${ADMIN_STUDENT_API_URL}/student`,
    data
  ).then((res) => res.data);

export const editStudent = (studentId: string, data: Partial<IStudent>) =>
  apiRequest<ApiResponse<IStudent>, Partial<IStudent>>(
    'patch',
    `${ADMIN_STUDENT_API_URL}/${studentId}`,
    data
  ).then((res)=>res.data);

export const deleteStudent = (studentId: string) =>
  apiRequest<ApiResponse<void>, string>(
    'delete',
    `${ADMIN_STUDENT_API_URL}/${studentId}`
  );

export const createRecurringFee = async (feeData: Omit<RecurringFee, 'id'>)=>
  await apiRequest<ApiResponse<RecurringFee>, typeof feeData>(
    'post',
    `${ADMIN_STUDENT_API_URL}/fees/recurring`,
    feeData
  )
    .then((res)=> res.data);
    
export const getAllRecurringFees = async () =>
  await apiRequest<ApiResponse<RecurringFee[]>>(
    'get',
    `${ADMIN_STUDENT_API_URL}/fees/recurring`
  )
    .then((res)=> res.data);

export const generateMonthlyDues = async (month: string) =>
  await apiRequest<ApiResponse<{ message: string }>, { month: string }>(
    'post',
    `${ADMIN_STUDENT_API_URL}/fees/generate-dues`,
    { month }
  )
    .then((res)=> res.data);

export const getPaymentStatuses = async () =>
  await apiRequest<ApiResponse<StudentFeeDue[]>>(
    'get',
    `${ADMIN_STUDENT_API_URL}/payments`
  )
    .then((res)=> res.data);