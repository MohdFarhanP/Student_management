import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ImSpinner2 } from 'react-icons/im';
import { getTeachersNames } from '../api/adminApi';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: {
    subjectName: string;
    teachers: string[];
    notes: File[];
  }) => void;
}
interface Teacher {
  name: string;
  id: string;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [subjectName, setSubjectName] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [notesFiles, setNotesFiles] = useState<File[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const responseTeachers = await getTeachersNames();
      if (responseTeachers) {
        setTeachers(responseTeachers);
      }
    };
    fetchTeachers();
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const invalidFiles = files.filter(
      (file) => file.type !== 'application/pdf'
    );

    if (invalidFiles.length > 0) {
      toast.error('Only PDF files are allowed.');
      return;
    }

    setNotesFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleTeacherSelection = (teacher: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };

  const handleSubmit = async () => {
    if (!subjectName || selectedTeachers.length === 0) {
      toast.error('Please enter subject name and select at least one teacher.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        subjectName: subjectName,
        teachers: selectedTeachers,
        notes: notesFiles,
      });

      setSubjectName('');
      setSelectedTeachers([]);
      setNotesFiles([]);
      onClose();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to add subject.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-screen w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Add New Subject
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            placeholder="Enter subject name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Teachers
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => handleTeacherSelection(teacher.name)}
                className={`rounded-md px-3 py-1 text-sm ${
                  selectedTeachers.includes(teacher.name)
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {teacher.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Notes (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            className="mt-1 w-full cursor-pointer rounded-md border border-gray-300 p-2 text-gray-700 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {notesFiles.length > 0 && (
          <div className="mb-4 text-sm text-gray-700">
            <p className="font-semibold">Selected Notes:</p>
            <ul className="list-disc pl-5">
              {notesFiles.map((file, index) => (
                <li key={index} className="text-gray-600">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md bg-gray-300 px-4 py-2 text-black transition hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-black/90 px-4 py-2 text-white transition hover:bg-black"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <ImSpinner2 className="animate-spin" /> Adding...
              </span>
            ) : (
              'Add Subject'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
