import React, { Suspense, lazy, useState } from 'react';
import { deleteStudent, IStudent } from '../api/admin/studentApi';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import profile from '../assets/profile.jpg';

const PaginationButton = lazy(() => import('./PaginationButton'));
const ConfirmDialog = lazy(() => import('./ConfirmDialog'));

interface StudentTableProps {
  students: IStudent[];
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedStudent: (student: IStudent | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  totalPages,
  page,
  setPage,
  setSelectedStudent,
  setIsOpen,
  onDelete,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(null);

  const handleEdit = (student: IStudent) => {
    setSelectedStudent(student);
    setIsOpen(true);
  };

  const handleDelete = (studentId: string) => {
    setStudentIdToDelete(studentId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentIdToDelete) return;
    try {
      await deleteStudent(studentIdToDelete);
      onDelete(studentIdToDelete);
      setIsConfirmOpen(false);
      setStudentIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      setIsConfirmOpen(false);
      setStudentIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setStudentIdToDelete(null);
  };

  return (
    <div className="flex-1">
      {/* Student Cards */}
      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student.roleNumber}
            className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-center p-4 gap-4">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <img
                    src={student.profileImage || profile}
                    alt={student.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {student.name}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Age:</span>
                    <span className="text-gray-700 dark:text-gray-200">{student.age}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                    <span className="text-gray-700 dark:text-gray-200">{student.gender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Class:</span>
                    <span className="text-gray-700 dark:text-gray-200">{student.class || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm rounded-full tooltip"
                  data-tip="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(student);
                  }}
                >
                  <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  className="btn btn-ghost btn-sm rounded-full tooltip"
                  data-tip="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(student.id);
                  }}
                >
                  <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PaginationButton
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Confirmation Dialog */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ConfirmDialog
            isOpen={isConfirmOpen}
            message="Are you sure you want to delete this student?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default React.memo(StudentTable);