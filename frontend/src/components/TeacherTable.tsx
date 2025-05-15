import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteTeacher } from '../api/admin/teacherApi';
import { ITeacher } from '../pages/admin/Teacher';
import PaginationButton from './PaginationButton';
import ConfirmDialog from './ConfirmDialog';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TeacherTableProps {
  teachers: ITeacher[];
  totalPages: number;
  setSelectedTeacher: (teacher: ITeacher) => void;
  setIsOpen: (isOpen: boolean) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onDelete: (teacherId: string) => void;
}

const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  totalPages,
  setSelectedTeacher,
  setIsOpen,
  page,
  setPage,
  onDelete,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teacherIdToDelete, setTeacherIdToDelete] = useState<string | null>(null);

  const handleEdit = (teacher: ITeacher) => {
    setSelectedTeacher(teacher);
    setIsOpen(true);
  };

  const handleDelete = (teacherId: string) => {
    setTeacherIdToDelete(teacherId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!teacherIdToDelete) return;
    try {
      await deleteTeacher(teacherIdToDelete);
      onDelete(teacherIdToDelete);
      toast.success('Teacher deleted successfully');
      setIsConfirmOpen(false);
      setTeacherIdToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete teacher');
      setIsConfirmOpen(false);
      setTeacherIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setTeacherIdToDelete(null);
  };

  return (
    <div className="flex-1">
      {/* Teacher Cards */}
      <div className="space-y-3">
        {teachers.map((teacher) => (
          <div
            key={teacher.empId}
            className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedTeacher(teacher)}
          >
            <div className="flex items-center p-4 gap-4">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {teacher.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={teacher.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-500 dark:text-gray-300">
                      {teacher.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {teacher.name}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Age:</span>
                    <span className="text-gray-700 dark:text-gray-200">{teacher.age}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                    <span className="text-gray-700 dark:text-gray-200">{teacher.gender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Class:</span>
                    <span className="text-gray-700 dark:text-gray-200">{teacher.assignedClass || 'N/A'}</span>
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
                    handleEdit(teacher);
                  }}
                >
                  <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  className="btn btn-ghost btn-sm rounded-full tooltip"
                  data-tip="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(teacher.id);
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
        <PaginationButton
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this teacher?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default TeacherTable;