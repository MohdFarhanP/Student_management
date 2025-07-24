import {
  ChangeEvent,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IStudent, searchStudents } from '../../api/admin/studentApi';
import { getStudents } from '../../api/admin/studentApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import SearchBar from '../../components/SearchBar';
import { ITeacher } from './Teacher';
import StudentTeacherProfileCard from '../../components/StudentTeacherProfileCard';

// Lazy-load components
const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const BulkUploadButton = lazy(
  () => import('../../components/BulkUploadButton')
);
const EditStudentModal = lazy(
  () => import('../../components/EditStudentModal')
);
const AddStudentModal = lazy(() => import('../../components/AddStudentModal'));
const StudentTeacherTable = lazy(
  () => import('../../components/StudentTeacherTable')
);

const Student = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [students, setStudents] = useState<IStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fetch = useCallback(async () => {
    const { students, totalCount } = await getStudents(page, limit);
    console.log('studentpage', students, totalCount);
    setStudents(students);
    setTotalCount(totalCount);
  }, [page, limit]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetch();
    }
  }, [searchTerm, page, fetch]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddStudent = (newStudent: IStudent) => {
    setStudents((prevStudents) => [newStudent, ...prevStudents]);
    setTotalCount((prevCount) => prevCount + 1);
  };

  const handleUpdateStudent = (updatedStudent: IStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s.id !== studentId)
    );
    setTotalCount((prevCount) => prevCount - 1);
    if (selectedStudent?.id === studentId) setSelectedStudent(null);
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target?.value);
    if (searchTerm.trim() !== '') {
      const students = await searchStudents(searchTerm);
      if (students) {
        setStudents(students);
        setTotalCount(students.length);
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
            Students
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <BulkUploadButton role={'Student'} />
              </Suspense>
            </ErrorBoundary>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm sm:btn-md"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          placeholder={'Search students by name...'}
          handleSearch={handleSearch}
        />

        {/* Student List and Profile Card */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentTeacherTable
                data={students}
                totalPages={totalPages}
                page={page}
                setPage={setPage}
                setSelectedItem={
                  setSelectedStudent as (
                    item: IStudent | ITeacher | null
                  ) => void
                }
                setIsOpen={setIsEditModalOpen}
                onDelete={handleDeleteStudent}
                itemType="student"
              />
            </Suspense>
          </ErrorBoundary>

          {selectedStudent && (
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <div className="lg:w-80">
                  <StudentTeacherProfileCard
                    selectedItem={selectedStudent}
                    renderDetails={(student) => (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-semibold">Age:</p>
                            <p>{student.age}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Roll No:</p>
                            <p>{student.roleNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Gender:</p>
                            <p>{student.gender}</p>
                          </div>
                          <div>
                            <p className="font-semibold">DOB:</p>
                            <p>{student.dob || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Class:</p>
                            <p>{student.class || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Subjects:</p>
                            <p>{student.subjectIds?.length || 0}</p>
                          </div>
                        </div>

                        {/* Address */}
                        <h3 className="mt-3 font-semibold">Address</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-semibold">House:</p>
                            <p>{student.address?.houseName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Place:</p>
                            <p>{student.address?.place || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">District:</p>
                            <p>{student.address?.district || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Pincode:</p>
                            <p>{student.address?.pincode || 'N/A'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-semibold">Phone:</p>
                            <p>{student.address?.phoneNo || 'N/A'}</p>
                          </div>
                        </div>

                        <h3 className="mt-3 font-semibold">Guardian</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-semibold">Name:</p>
                            <p>{student.address?.guardianName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Contact:</p>
                            <p>{student.address?.guardianContact || 'N/A'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  />
                </div>
              </Suspense>
            </ErrorBoundary>
          )}
        </div>

        {/* Modals */}
        {isEditModalOpen && selectedStudent && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <EditStudentModal
                studentData={selectedStudent}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateStudent}
              />
            </Suspense>
          </ErrorBoundary>
        )}
        {isAddModalOpen && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AddStudentModal
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddStudent}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Student;
