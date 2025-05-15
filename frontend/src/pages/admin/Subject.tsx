import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSideBar from '../../components/AdminSideBar';
import ClassDropdown from '../../components/ClassDropdown';
import AddSubjectModal from '../../components/AddSubjectModal';
import EditSubjectModal from '../../components/EditSubjectModal';
import {
  addSubject,
  getSubjectsByClass,
  updateSubject,
  deleteSubject,
  ISubject,
} from '../../api/admin/subjectApi';
import { AxiosError } from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
      );
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
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
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
            <ClassDropdown onSelectClass={setSelectedClass} />
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

        {!selectedClass &&(
          <p className="col-span-full text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
              Please select a slass from dropdown.
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
            <div
              key={subject.id}
              className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-4">
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {subject.subjectName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-ghost btn-sm rounded-full tooltip"
                      data-tip="Edit"
                      onClick={() => handleEditSubject(subject)}
                    >
                      <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm rounded-full tooltip"
                      data-tip="Delete"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Notes
                  </h3>
                  {Array.isArray(subject.notes) && subject.notes.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subject.notes.map((note, index) => (
                        <img
                          key={index}
                          src={note}
                          alt="Note"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No notes available
                    </p>
                  )}
                </div>

                {/* Teachers */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Teachers
                  </h3>
                  {Array.isArray(subject.teachers) && subject.teachers.length > 0 ? (
                    <ul className="mt-1 max-h-20 overflow-y-auto text-sm text-gray-600 dark:text-gray-400">
                      {subject.teachers.map((teacher, index) => (
                        <li key={index} className="truncate">
                          {typeof teacher === 'string' ? teacher : teacher.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No teachers assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <AddSubjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubject}
        />
        {selectedSubject && (
          <EditSubjectModal
            subject={selectedSubject}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleUpdateSubject}
          />
        )}
      </div>
    </div>
  );
};

export default Subject;