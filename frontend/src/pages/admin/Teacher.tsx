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
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); // For AdminSideBar

  useEffect(() => {
    const fetch = async () => {
      const { teachers, totalCount } = await getTeachers(page, limit);
      setTeachers(teachers);
      setTotalCount(totalCount ?? 0);
    };
    fetch();
  }, [page]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddTeacher = (newTeacher: ITeacher) => {
    setTeachers((prevTeachers) => [newTeacher, ...prevTeachers]);
    setTotalCount((prevCount) => prevCount + 1);
  };

  const handleEditTeacher = (updatedTeacher: ITeacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((t) => t.id !== teacherId)
    );
    setTotalCount((prevCount) => prevCount - 1);
    if (selectedTeacher?.id === teacherId) setSelectedTeacher(null);
  };

  const filterTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        {/* Header */}
        <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
            Teachers
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <BulkUploadButton role={'Teacher'} />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm sm:btn-md"
            >
              Add Teacher
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md mb-6 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring-primary"
          placeholder="Search teachers by name..."
        />

        {/* Teacher List and Profile Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          <TeacherTable
            setSelectedTeacher={setSelectedTeacher}
            teachers={filterTeachers}
            totalPages={totalPages}
            setIsOpen={setIsEditModalOpen}
            page={page}
            setPage={setPage}
            onDelete={handleDeleteTeacher}
          />
          {selectedTeacher && (
            <div className="lg:w-80">
              <ProfileCardTeacher selectedTeacher={selectedTeacher} />
            </div>
          )}
        </div>

        {/* Modals */}
        {isEditModalOpen && selectedTeacher && (
          <EditTeacherModal
            teacherData={selectedTeacher}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEditTeacher}
          />
        )}
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