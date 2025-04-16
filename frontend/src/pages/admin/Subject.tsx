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
} from '../../api/admin/subjectApi';
import { AxiosError } from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Subject = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<
    { _id: string; subjectName: string; teachers: string[]; notes: string[] }[]
  >([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<{
    _id: string;
    subjectName: string;
    teachers: string[];
    notes: string[];
  } | null>(null);

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

  const handleEditSubject = (subject: {
    _id: string;
    subjectName: string;
    teachers: string[];
    notes: string[];
  }) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubject = async (updatedSubject: {
    subjectName: string;
    teachers: string[];
    notes: File[];
  }) => {
    if (!selectedSubject || !selectedClass) return;

    try {
      const result = await updateSubject(
        selectedClass,
        selectedSubject._id,
        updatedSubject
      );
      setSubjects((prev) =>
        prev.map((sub) => (sub._id === selectedSubject._id ? result : sub))
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
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(selectedClass, subjectId);
        setSubjects((prev) => prev.filter((sub) => sub._id !== subjectId));
        toast.success('Subject deleted successfully!');
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.error || 'Error deleting subject!');
        } else {
          toast.error((error as Error).message || 'Unknown error occurred.');
        }
      }
    }
  };

  return (
    <div className="flex bg-white">
      <AdminSideBar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Subjects</h1>
        <div className="mb-6">
          <ClassDropdown onSelectClass={setSelectedClass} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="w-full max-w-[180px] rounded-2xl bg-blue-200 p-5 shadow-lg transition duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="truncate text-lg font-semibold text-black">
                  {subject.subjectName}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="text-black transition duration-200 hover:text-blue-600"
                    title="Edit Subject"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="text-black transition duration-200 hover:text-red-600"
                    title="Delete Subject"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              <hr className="my-2 border-black" />
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-black underline">
                  Notes
                </h3>
                {Array.isArray(subject.notes) && subject.notes.length > 0 ? (
                  subject.notes.map((note, index) => (
                    <img
                      key={index}
                      src={note}
                      alt="Note"
                      className="mt-1 h-10 w-10 rounded-md object-cover"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No notes available</p>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-black">Teachers</h3>
                <ul className="mt-2 max-h-20 overflow-y-auto">
                  {Array.isArray(subject.teachers) &&
                  subject.teachers.length > 0 ? (
                    subject.teachers.map((teacher, index) => (
                      <li key={index} className="truncate text-sm text-black">
                        {teacher}
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">
                      No teachers assigned
                    </p>
                  )}
                </ul>
              </div>
            </div>
          ))}
          <div
            className="flex w-full max-w-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-lg transition duration-300 hover:shadow-xl"
            onClick={() =>
              selectedClass
                ? setIsAddModalOpen(true)
                : toast.info('Please select a class')
            }
          >
            <h3 className="pb-5 text-sm font-semibold text-gray-500">New</h3>
            <button className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-black pb-0.5 text-2xl text-white transition duration-300 hover:bg-gray-800">
              +
            </button>
          </div>
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
    </div>
  );
};

export default Subject;
