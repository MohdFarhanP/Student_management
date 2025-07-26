import { Suspense, lazy, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  addSubject,
  getSubjectsByClass,
  updateSubject,
  deleteSubject,
  ISubject,
} from '../../api/admin/subjectApi';
import { AxiosError } from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy-load components
const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const ClassDropdown = lazy(() => import('../../components/ClassDropdown'));
const AddSubjectModal = lazy(() => import('../../components/AddSubjectModal'));
const EditSubjectModal = lazy(() => import('../../components/EditSubjectModal'));
const SubjectCard = lazy(() => import('../../components/SubjectCard'));

const Subject = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<ISubject | null>(null);
  const [isOpen, setIsOpen] = useState(false); // For AdminSideBar

  useEffect(() => {
    if (!selectedClass) return;

    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await getSubjectsByClass(selectedClass);
        setSubjects(fetchedSubjects || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to fetch subjects.');
      }
    };

    fetchSubjects();
  }, [selectedClass]);

  const handleAddSubject = async (subject: {
    subjectName: string;
    teachers: string[];
    notes: File[] | null;
  }) => {
    try {
      const newSubject = await addSubject(selectedClass, subject);
      if (!newSubject || typeof newSubject !== 'object') {
        throw new Error('Invalid response from server');
      }
      setIsAddModalOpen(false);
      setSubjects((prev) => [...prev, newSubject]);
      toast.success('Subject added successfully!');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Error adding subject!');
      } else {
        toast.error((error as Error).message || 'Unknown error occurred.');
      }
    }
  };

  const handleEditSubject = (subject: ISubject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubject = async (updatedSubject: {
    id: string;
    subjectName: string;
    teachers: string[];
    notes: File[];
  }) => {
    if (!selectedSubject || !selectedClass) return;

    try {
      const result = await updateSubject(
        selectedClass,
        selectedSubject.id,
        updatedSubject
      ) as ISubject;;
      setSubjects((prev) =>
        prev.map((sub) => (sub.id === selectedSubject.id ? result : sub))
      );
      setIsEditModalOpen(false);
      setSelectedSubject(null);
      toast.success('Subject updated successfully!');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Error updating subject!');
      } else {
        toast.error((error as Error).message || 'Unknown error occurred.');
      }
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteSubject(selectedClass, subjectId);
      setSubjects((prev) => prev.filter((sub) => sub.id !== subjectId));
      toast.success('Subject deleted successfully!');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Error deleting subject!');
      } else {
        toast.error((error as Error).message || 'Unknown error occurred.');
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
            Subjects
          </h1>
          <div className="flex items-center gap-3">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ClassDropdown onSelectClass={setSelectedClass} />
              </Suspense>
            </ErrorBoundary>
            <button
              onClick={() =>
                selectedClass
                  ? setIsAddModalOpen(true)
                  : toast.info('Please select a class')
              }
              className="btn btn-primary btn-sm sm:btn-md"
            >
              Add Subject
            </button>
          </div>
        </div>

        {!selectedClass && (
          <p className="col-span-full text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
            Please select a class from dropdown.
          </p>
        )}

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {subjects.length === 0 && selectedClass && (
            <p className="col-span-full text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
              No subjects available for this class.
            </p>
          )}
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} handleEditSubject={handleEditSubject} handleDeleteSubject={handleDeleteSubject} />
          ))}
        </div>

        {/* Modals */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AddSubjectModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddSubject}
            />
          </Suspense>
        </ErrorBoundary>
        {selectedSubject && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <EditSubjectModal
                subject={selectedSubject}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateSubject}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Subject;