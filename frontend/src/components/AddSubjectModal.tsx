import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ImSpinner2 } from 'react-icons/im';
import { getTeachersNames } from '../api/admin/teacherApi';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: {
    subjectName: string;
    teachers: string[];
    notes: File[] | null;
  }) => void;
}

interface Teacher {
  name: string;
  id: string;
}

const SUBJECT_OPTIONS = [
  'Malayalam',
  'Tamil',
  'Kannada',
  'Urudu',
  'English',
  'Sanskrit',
  'Arabic',
  'Hindi',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'EnvironmentalScience',
  'BasicScience',
  'SocialScience',
  'PhysicalEducation',
  'InformationTechnology',
];

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
  const [errors, setErrors] = useState<{ subjectName?: string; teachers?: string }>({});

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

  const validateForm = () => {
    const newErrors: { subjectName?: string; teachers?: string } = {};

    const trimmedSubjectName = subjectName.trim();
    if (!trimmedSubjectName) {
      newErrors.subjectName = 'Subject name is required.';
    } else if (trimmedSubjectName.length < 3) {
      newErrors.subjectName = 'Subject name must be at least 3 characters long.';
    } else if (trimmedSubjectName.length > 50) {
      newErrors.subjectName = 'Subject name must not exceed 50 characters.';
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedSubjectName)) {
      newErrors.subjectName = 'Subject name can only contain letters, numbers, spaces, hyphens, or underscores.';
    }

    if (selectedTeachers.length === 0) {
      newErrors.teachers = 'At least one teacher must be selected.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const invalidFiles = files.filter((file) => file.type !== 'application/pdf');

    if (invalidFiles.length > 0) {
      toast.error('Only PDF files are allowed.');
      return;
    }

    setNotesFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((t) => t !== teacherId)
        : [...prev, teacherId]
    );
    setErrors((prev) => ({ ...prev, teachers: undefined }));
  };

  const removeNote = (fileName: string) => {
    setNotesFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        subjectName: subjectName.trim(),
        teachers: selectedTeachers,
        notes: notesFiles,
      });
      setSubjectName('');
      setSelectedTeachers([]);
      setNotesFiles([]);
      setErrors({});
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to add subject.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-md bg-base-100 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white">
            Add New Subject
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="btn btn-sm btn-circle btn-ghost text-gray-600 dark:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Subject Name
              </label>
              <select
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  setErrors((prev) => ({ ...prev, subjectName: undefined }));
                }}
                className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              >
                <option value="">Select a subject</option>
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subjectName && (
                <p className="mt-1 text-xs text-error">{errors.subjectName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Select Teachers
              </label>
              <div className="mt-1 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => handleTeacherSelection(teacher.id)}
                    className={`btn btn-sm ${
                      selectedTeachers.includes(teacher.id)
                        ? 'btn-primary'
                        : 'btn-outline btn-neutral'
                    } text-xs sm:text-sm`}
                    disabled={loading}
                  >
                    {teacher.name}
                  </button>
                ))}
              </div>
              {errors.teachers && (
                <p className="mt-1 text-xs text-error">{errors.teachers}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Upload Notes (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              />
              {notesFiles.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {notesFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="truncate">{file.name}</span>
                      <button
                        onClick={() => removeNote(file.name)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="btn btn-outline btn-sm sm:btn-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary btn-sm sm:btn-md"
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
      </div>
    </div>
  );
};

export default React.memo(AddSubjectModal);