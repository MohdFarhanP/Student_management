import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteTeacher } from '../api/admin/teacherApi';
import { ITeacher } from '../pages/admin/Teacher';
import PaginationButton from './PaginationButton';
import ConfirmDialog from './ConfirmDialog';

interface TeacherTableProps {
  teachers: ITeacher[];
  totalPages: number;
  setSelectedTeacher: (teacher: ITeacher) => void;
  setIsOpen: (isOpen: boolean) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onDelete: (studentId: string) => void
}

const TeacherTable = ({
  teachers,
  totalPages,
  setSelectedTeacher,
  setIsOpen,
  page,
  setPage,
  onDelete
}: TeacherTableProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teacherIdToDelete, setTeacherIdToDelete] = useState<string | null>(
    null
  );

  const handleDelete = (teacherId: string) => {
    setTeacherIdToDelete(teacherId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!teacherIdToDelete) return;
    try {
      await deleteTeacher(teacherIdToDelete);
      onDelete(teacherIdToDelete)
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-sm font-semibold uppercase">
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Age</th>
              <th className="px-5 py-3 text-left">Gender</th>
              <th className="px-5 py-3 text-left">Assigned Class</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr
                key={teacher.empId}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTeacher(teacher)}
              >
                <td className="px-5 py-4 text-black">{teacher.name}</td>
                <td className="px-5 py-4 text-gray-700">
                  {new Date().getFullYear() -
                    new Date(teacher.dateOfBirth).getFullYear() || 'N/A'}
                </td>
                <td className="px-5 py-4 text-gray-700">{teacher.gender}</td>
                <td className="px-5 py-4 text-gray-700">
                  {teacher.assignedClass || 'N/A'}
                </td>
                <td className="flex justify-around px-5 py-4 text-center">
                  <button
                    className="btn btn-sm w-1/2 bg-black text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeacher(teacher);
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="btn btn-sm border-none bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination below the table */}
      <div className="mt-4">
        <PaginationButton
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* Custom confirmation dialog */}
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
