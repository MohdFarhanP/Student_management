import { useEffect, useState } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import BulkUploadButton from '../../components/BulkUploadButton';
import { getTeachers } from '../../api/admin/teacherApi';
import ProfileCardTeacher from '../../components/ProfileCardTeacher';
import EditTeacherModal from '../../components/EditTeacherModal';
import TeacherTable from '../../components/TeacherTable';
import AddTeacherModal from '../../components/AddTeacherModal';

export interface ITeacher {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  phoneNo: number;
  empId: string;
  assignedClass: string;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  subject?: string;
  experienceYears?: number;
  qualification?: string;
}

const Teacher = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const { teachers, totalCount } = await getTeachers(page, limit);
      setTeachers(teachers);
      setTotalCount(totalCount);
    };
    fetch();
  }, [page]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddTeacher = (newTeacher: ITeacher) => {
    setTeachers((prevTeachers) => [newTeacher, ...prevTeachers]);
    setTotalCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSideBar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="my-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Teachers</h1>
          <div className="flex space-x-4">
            <BulkUploadButton role={'Teacher'} />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Teacher
            </button>
          </div>
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
            setIsOpen={setIsEditModalOpen}
            page={page}
            setPage={setPage}
          />
          {/* Profile Card */}
          {selectedTeacher && (
            <ProfileCardTeacher selectedTeacher={selectedTeacher} />
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedTeacher && (
          <EditTeacherModal
            teacherData={selectedTeacher}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <AddTeacherModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddTeacher}
          />
        )}
      </div>
    </div>
  );
};

export default Teacher;
