import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

export const STUDENT_API_URL = '/student';

interface StudentAddress {
  houseName: string;
  place: string;
  district: string;
  pincode: number;
  phoneNo: number;
  guardianName: string;
  guardianContact: string;
}

export interface studentInfo {
  id:string,
  name:string,
  email: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: string;
  age: number;
  class: string;
  subjectIds: string[];
  profileImage: string;
  address: StudentAddress;
}

interface Attendance {
  classId: string;
  studentId: string;
  date: string;
  period: number;
  status: 'present' | 'absent';
  day: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateProfileImgParams {
  profileImage: string;
  email: string;
  fileHash: string;
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

interface PaymentResponse {
  order: { id: string };
  paymentId: string;
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const studentsProfileFetch = (email: string) =>
  apiRequest<ApiResponse<StudentProfile>>('get', `${STUDENT_API_URL}/profile/${email}`)
    .then((res)=> res.data);

export const fetchAttendance = (id: string) =>
  apiRequest<ApiResponse<Attendance[]>>('get', `${STUDENT_API_URL}/attendance/${id}`)
    .then((res)=> res.data!);

export const updateProfileImg = (fileHash: string, imgUrl: string, email: string) =>{
  console.log('student profile details', imgUrl,email)
  apiRequest<ApiResponse<StudentProfile>, UpdateProfileImgParams>(
    'patch',
    `${STUDENT_API_URL}/profile/image`,
    { email, profileImage: imgUrl, fileHash }
  ).then((res) => {
    toast.success('Profile image updated successfully');
    return res.data;
  });
}

export const getStdInfo = async () =>
  apiRequest<ApiResponse<studentInfo>>('get', `${STUDENT_API_URL}/info`).then(
    (res) => res.data
  );

export const getUnpaidDues = async () =>
  apiRequest<ApiResponse<StudentFeeDue[]>>('get', `${STUDENT_API_URL}/fees/due`).then(
    (res) => res.data
  );

export const processPayment = async (feeDueId: string) =>
  apiRequest<ApiResponse<PaymentResponse>,{feeDueId:string}>('post', `${STUDENT_API_URL}/fees/pay`, {
    feeDueId,
  }).then((res) => res.data! );