import { ChangeEvent, Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { getTeachers, searchTeachers } from '../../api/admin/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
// import { ITeacher } from './Teacher';
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

// Lazy-load components
const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const BulkUploadButton = lazy(() => import('../../components/BulkUploadButton'));
const ProfileCardTeacher = lazy(() => import('../../components/ProfileCardTeacher'));
const EditTeacherModal = lazy(() => import('../../components/EditTeacherModal'));
const AddTeacherModal = lazy(() => import('../../components/AddTeacherModal'));
const TeacherTable = lazy(() => import('../../components/TeacherTable'));

const Teacher = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); 

  const fetch = useCallback(async () => {
    const data = await getTeachers(page, limit);
    if (data) {
      setTeachers(data.teachers ?? []);
      setTotalCount(data.totalCount ?? 0);
    } else {
      setTeachers([]);
      setTotalCount(0);
    }
  }, [page, limit]);

  useEffect(() => {
    if(searchTerm.trim() === '') {
      fetch();
    }
  }, [searchTerm,page, fetch]);


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

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target?.value)
    if (searchTerm.trim() !== '') {
      const teachers = await searchTeachers(searchTerm);
      if (teachers) {
        setTeachers(teachers);
        setTotalCount(teachers.length);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Suspense>
      </ErrorBoundary>
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
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <BulkUploadButton role={'Teacher'} />
              </Suspense>
            </ErrorBoundary>
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
          onChange={(e) => handleSearch(e)}
          className="input input-bordered w-full max-w-md mb-6 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring-primary"
          placeholder="Search teachers by name..."
        />

        {/* Teacher List and Profile Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <TeacherTable
                setSelectedTeacher={setSelectedTeacher}
                teachers={teachers}
                totalPages={totalPages}
                setIsOpen={setIsEditModalOpen}
                page={page}
                setPage={setPage}
                onDelete={handleDeleteTeacher}
              />
            </Suspense>
          </ErrorBoundary>
          {selectedTeacher && (
            <div className="lg:w-80">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileCardTeacher selectedTeacher={selectedTeacher} />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
        </div>

        {/* Modals */}
        {isEditModalOpen && selectedTeacher && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <EditTeacherModal
                teacherData={selectedTeacher}
                onClose={() => setIsEditModalOpen(false)}
                onEdit={handleEditTeacher}
              />
            </Suspense>
          </ErrorBoundary>
        )}
        {isAddModalOpen && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AddTeacherModal
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTeacher}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Teacher;