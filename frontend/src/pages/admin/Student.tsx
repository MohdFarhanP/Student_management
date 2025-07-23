import { ChangeEvent, Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { IStudent, searchStudents } from '../../api/admin/studentApi';
import { getStudents } from '../../api/admin/studentApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import SearchBar from '../../components/searchBar';

// Lazy-load components
const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const BulkUploadButton = lazy(() => import('../../components/BulkUploadButton'));
const StudentTable = lazy(() => import('../../components/StudentTable'));
const ProfileCardStudents = lazy(() => import('../../components/ProfileCardStudents'));
const EditStudentModal = lazy(() => import('../../components/EditStudentModal'));
const AddStudentModal = lazy(() => import('../../components/AddStudentModal'));

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
    console.log("studentpage", students, totalCount);
    setStudents(students);
    setTotalCount(totalCount);
  },[page, limit]);

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
    setSearchTerm(e.target?.value)
    if (searchTerm.trim() !== '') {
      const students = await searchStudents(searchTerm);
      if (students) {
        setStudents(students);
        setTotalCount(students.length);
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
            Students
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
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
        <SearchBar searchTerm={searchTerm} placeholder={"Search students by name..."} handleSearch={handleSearch}/>

        {/* Student List and Profile Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentTable
                setSelectedStudent={setSelectedStudent}
                students={students}
                totalPages={totalPages}
                setIsOpen={setIsEditModalOpen}
                page={page}
                setPage={setPage}
                onDelete={handleDeleteStudent}
              />
            </Suspense>
          </ErrorBoundary>
          {selectedStudent && (
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <div className="lg:w-80">
                  <ProfileCardStudents selectedStudent={selectedStudent} />
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