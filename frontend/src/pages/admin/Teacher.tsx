import { useEffect, useState } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import BulkUploadButton from '../../components/BulkUploadButton';
import { getTeachers } from '../../api/adminApi'; // Replace with your actual API function
import ProfileCardTeacher from '../../components/ProfileCardTeacher'; 
import EditTeacherModal from '../../components/EditTeacherModal';
import TeacherTable from '../../components/TeacherTable';

export interface ITeacher {
  id: string;
  name: string;
  email: string;
  gender: string;
  phoneNo: number;
  empId: string;
  assignedClass: string;
  subject: string;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears: number;
  qualification?: string;
}

const Teacher = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const { teachers, totalCount } = await getTeachers(page, limit);
      setTeachers(teachers);
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
          <h1 className="text-2xl font-bold text-black">Teachers</h1>
          <BulkUploadButton role={'Teacher'} />
        </div>

        {/* Search Bar */}
        <input
          type="search"
          className="mb-6 w-xl rounded-lg border border-gray-300 p-2 text-black focus:ring-2 focus:ring-gray-300 focus:outline-none"
          placeholder="Search teachers by name..."
        />

        <div className="flex gap-6">
          {/* Teacher Table */}
          <TeacherTable
            setSelectedTeacher={setSelectedTeacher}
            teachers={teachers}
            totalPages={totalPages}
            setIsOpen={setIsOpen}
            page={page}
            setPage={setPage}
          />
          {/* Profile Card */}
          {selectedTeacher && <ProfileCardTeacher selectedTeacher={selectedTeacher} />}

          {/* Edit Modal */}
          {isOpen && selectedTeacher && (
            <EditTeacherModal
              teacherData={selectedTeacher}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Teacher;