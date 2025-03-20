import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSideBar from '../../components/AdminSideBar';
import ClassDropdown from '../../components/ClassDropdown';
import AddSubjectModal from '../../components/AddSubjectModal';
import { addSubject, getSubjectsByClass } from '../../api/adminApi';
import { AxiosError } from 'axios';

const Subject = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<
    { _id: string; subjectName: string; teachers: string[]; notes: string[] }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      await addSubject(selectedClass, subject);
      toast.success('Subject added successfully');
      setIsModalOpen(false);
      setSubjects([
        ...subjects,
        { ...subject, _id: crypto.randomUUID(), notes: [] },
      ]);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Error adding subject!');
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
              className={`w-full max-w-[180px] rounded-2xl bg-blue-200 p-5 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">
                  {subject.subjectName}
                </h2>
                <span className="cursor-pointer text-xl text-black">➤</span>
              </div>

              <hr className="my-2 border-black" />

              <div className="mt-2">
                <h3 className="text-sm font-semibold text-black underline">
                  Notes
                </h3>
                {subject.notes.length > 0 ? (
                  subject.notes.map((note, index) => (
                    <img
                      key={index}
                      src={note}
                      alt="Note"
                      className="mt-1 h-10 w-10"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No notes available</p>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold text-black">Teachers</h3>
                <ul className="mt-2">
                  {subject.teachers.length > 0 ? (
                    subject.teachers.map((teacher, i) => (
                      <li key={i} className="text-sm text-black">
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
            className="flex w-full max-w-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-lg"
            onClick={() =>
              selectedClass
                ? setIsModalOpen(true)
                : toast.info('Please select a class')
            }
          >
            <h3 className="pb-5 text-sm font-semibold text-gray-500">New</h3>
            <button className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-black pb-0.5 text-2xl text-white transition duration-300 hover:bg-black">
              +
            </button>
          </div>

          <AddSubjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddSubject}
          />
        </div>
      </div>
    </div>
  );
};

export default Subject;
