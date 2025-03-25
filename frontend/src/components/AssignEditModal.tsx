import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetchSubjectsByClassId } from '../api/adminApi';

type FormData = {
  teacherId: string;
  subject: string;
};
type Subject = {
  id: string;
  name: string;
};
type AssignEditModalProps = {
  mode: 'assign' | 'edit';
  teachers: { _id: string; name: string }[];
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
        setSubjects(subjectsData);
      } catch (err: unknown) {
        if (err instanceof AxiosError) console.log(err?.message)
      }
    };

    fetchSubjects();
  }, [classId]);

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {mode === 'assign' ? 'Assign Teacher' : 'Edit Slot'}
        </h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Teacher Selection */}
          <div>
            <label
              htmlFor="teacherId"
              className="block text-sm font-medium text-gray-700"
            >
              Teacher
            </label>
            <select
              id="teacherId"
              {...register('teacherId', { required: 'Teacher is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.teacherId.message}
              </p>
            )}
          </div>

          {/* Subject Input */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <select
              id="subject"
              {...register('subject', { required: 'Subject is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:border-black focus:ring-black"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black/95 px-4 py-2 text-white transition-colors hover:bg-black"
            >
              {mode === 'assign' ? 'Assign' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignEditModal;
