import { useState } from 'react';
import { deleteStudent, IStudent } from '../api/admin/studentApi';
import PaginationButton from './PaginationButton';
import ConfirmDialog from './ConfirmDialog';

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
  const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(
    null
  );

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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-sm font-semibold uppercase">
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Age</th>
              <th className="px-5 py-3 text-left">Gender</th>
              <th className="px-5 py-3 text-left">Class</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student.roleNumber}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedStudent(student)}
              >
                <td className="px-5 py-4 text-black">{student.name}</td>
                <td className="px-5 py-4 text-gray-700">{student.age}</td>
                <td className="px-5 py-4 text-gray-700">{student.gender}</td>
                <td className="px-5 py-4 text-gray-700">
                  {student.class || 'N/A'}
                </td>
                <td className="flex justify-around px-5 py-4 text-center">
                  <button
                    className="btn btn-sm w-1/2 bg-black text-white"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
        message="Are you sure you want to delete this student?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default StudentTable;
