import { IStudent } from '../pages/admin/Student';
import PaginationButton from './PaginationButton';

interface StudentTableProps {
  students: IStudent[];
  totalPages: number;
  setSelectedStudent: (student: IStudent) => void;
  setIsOpen: (isOpen: boolean) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const StudentTable = ({
  students,
  totalPages,
  setSelectedStudent,
  setIsOpen,
  page,
  setPage,
}: StudentTableProps) => {
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
                <td className="px-5 py-4 text-center">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(student);
                      setIsOpen(true);
                    }}
                  >
                    Edit
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
    </div>
  );
};

export default StudentTable;
