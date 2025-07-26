import {
  ChangeEvent,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getTeachers, searchTeachers } from '../../api/admin/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import SearchBar from '../../components/SearchBar';
import { IStudent } from '../../api/admin/studentApi';
import StudentTeacherProfileCard from '../../components/StudentTeacherProfileCard';

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
const BulkUploadButton = lazy(
  () => import('../../components/BulkUploadButton')
);
const EditTeacherModal = lazy(
  () => import('../../components/EditTeacherModal')
);
const AddTeacherModal = lazy(() => import('../../components/AddTeacherModal'));
const StudentTeacherTable = lazy(
  () => import('../../components/StudentTeacherTable')
);

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
    if (searchTerm.trim() === '') {
      fetch();
    }
  }, [searchTerm, page, fetch]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddTeacher = async(newTeacher: ITeacher) => {
    setTeachers((prevTeachers) => [newTeacher, ...prevTeachers]);
    setTotalCount((prevCount) => prevCount + 1);
    await fetch();
    setSelectedTeacher(newTeacher);
  };

  const handleEditTeacher = async(updatedTeacher: ITeacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    await fetch();
    setSelectedTeacher(updatedTeacher);
  };

  const handleDeleteTeacher = async(teacherId: string) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((t) => t.id !== teacherId)
    );
    setTotalCount((prevCount) => prevCount - 1);
    if (selectedTeacher?.id === teacherId) setSelectedTeacher(null);
    await fetch();
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target?.value);
    if (searchTerm.trim() !== '') {
      const teachers = await searchTeachers(searchTerm);
      if (teachers) {
        setTeachers(teachers);
        setTotalCount(teachers.length);
      }
    }
  };

  return (
    <div className="bg-base-100 flex min-h-screen overflow-hidden dark:bg-gray-900">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Suspense>
      </ErrorBoundary>
      <div
        className={`max-h-screen flex-1 overflow-y-auto p-4 sm:p-6 ${
          isOpen ? 'overflow-hidden md:overflow-hidden' : ''
        }`}
      >
        {/* Header */}
        <div className="my-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base-content text-xl font-bold sm:text-2xl dark:text-white">
            Teachers
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row">
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
        <SearchBar
          searchTerm={searchTerm}
          placeholder={'Search teachers by name...'}
          handleSearch={handleSearch}
        />

        {/* Teacher List and Profile Card */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentTeacherTable
                data={teachers}
                totalPages={totalPages}
                page={page}
                setPage={setPage}
                setSelectedItem={
                  setSelectedTeacher as (
                    item: IStudent | ITeacher | null
                  ) => void
                }
                setIsOpen={setIsEditModalOpen}
                onDelete={handleDeleteTeacher}
                itemType="teacher"
              />
            </Suspense>
          </ErrorBoundary>

          {selectedTeacher && (
            <div className="lg:w-80">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentTeacherProfileCard
                    selectedItem={selectedTeacher}
                    renderDetails={(teacher) => (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Employee ID:</p>
                          <p>{teacher.empId}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Gender:</p>
                          <p>{teacher.gender}</p>
                        </div>
                        <div>
                          <p className="font-semibold">DOB:</p>
                          <p>{teacher.dateOfBirth || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Phone:</p>
                          <p>{teacher.phoneNo || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Assigned Class:</p>
                          <p>{teacher.assignedClass || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Subject:</p>
                          <p>{teacher.subject || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Experience (Years):</p>
                          <p>{teacher.experienceYears || 0}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Qualification:</p>
                          <p>{teacher.qualification || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-semibold">Specialization:</p>
                          <p>{teacher.specialization || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  />
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
