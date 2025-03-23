import { useEffect, useState } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import BulkUploadButton from '../../components/BulkUploadButton';
import { getStudents } from '../../api/adminApi';
import ProfileCardStudents from '../../components/ProfileCardStudents';
import EditStudentModal from '../../components/EditStudentModal';
import StudentTable from '../../components/StudentTable';

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
  address?: {
    houseName?: string;
    place?: string;
    district?: string;
    pincode?: string;
    phoneNo?: string;
    guardianName?: string;
    guardianContact?: string;
  };
}

const Student = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [students, setStudents] = useState<IStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const { students, totalCount } = await getStudents(page, limit);
      setStudents(students);
      setTotalCount(totalCount);
    };
    fetch();
  }, [page]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSideBar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="my-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Students</h1>
          <BulkUploadButton role={'Student'} />
        </div>

        {/* Search Bar */}
        <input
          type="search"
          className="mb-6 w-xl rounded-lg border border-gray-300 p-2 text-black focus:ring-2 focus:ring-gray-300 focus:outline-none"
          placeholder="Search students by name..."
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Student Table */}
          <StudentTable
            setSelectedStudent={setSelectedStudent}
            students={students}
            totalPages={totalPages}
            setIsOpen={setIsOpen}
            page={page}
            setPage={setPage}
          />
          {/* Profile Card */}
          {selectedStudent && (
            <ProfileCardStudents selectedStudent={selectedStudent} />
          )}

          {/*Edit modal */}
          {isOpen && selectedStudent && (
            <EditStudentModal
              studentData={selectedStudent}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
