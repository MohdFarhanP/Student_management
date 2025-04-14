import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

const STUDENT_API_URL = '/student';

interface StudentAddress {
  houseName: string;
  place: string;
  district: string;
  pincode: number;
  phoneNo: number;
  guardianName: string;
  guardianContact: string;
}

interface StudentProfile {
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
}

export const studentsProfileFetch = (email: string) =>
  apiRequest<StudentProfile>('get', `${STUDENT_API_URL}/profile/${email}`);

export const fetchAttendance = (id: string) =>
  apiRequest<Attendance[]>('get', `${STUDENT_API_URL}/attendance/${id}`);

export const updateProfileImg = (imgUrl: string, email: string) =>
  apiRequest<StudentProfile, UpdateProfileImgParams>(
    'patch',
    `${STUDENT_API_URL}/profile/image`,
    { email, profileImage: imgUrl }
  ).then((res) => {
    toast.success('Profile image updated successfully');
    return res;
  });
