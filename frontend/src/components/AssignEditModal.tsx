import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetchSubjectsByClassId } from '../api/admin/subjectApi';

type FormData = {
  teacherId: string;
  subject: string;
};

type Subject = {
  id: string;
  subjectName: string;
};

type AssignEditModalProps = {
  mode: 'assign' | 'edit';
  teachers: { id: string; name: string }[];
  classId: string;
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
};

const AssignEditModal: React.FC<AssignEditModalProps> = ({
  mode,
  teachers,
  classId,
  initialData,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData || { teacherId: '', subject: '' },
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsData = await fetchSubjectsByClassId(classId);
        setSubjects(subjectsData ?? []);
      } catch (err: unknown) {
        if (err instanceof AxiosError) console.log(err?.message);
      }
    };

    fetchSubjects();
  }, [classId]);

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-md bg-base-100 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white">
            {mode === 'assign' ? 'Assign Teacher' : 'Edit Slot'}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-gray-600 dark:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Teacher Selection */}
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Teacher
              </label>
              <select
                id="teacherId"
                {...register('teacherId', { required: 'Teacher is required' })}
                className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className="mt-1 text-xs text-error">{errors.teacherId.message}</p>
              )}
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Subject
              </label>
              <select
                id="subject"
                {...register('subject', { required: 'Subject is required' })}
                className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.subjectName}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-xs text-error">{errors.subject.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-sm sm:btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md"
              >
                {mode === 'assign' ? 'Assign' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignEditModal;