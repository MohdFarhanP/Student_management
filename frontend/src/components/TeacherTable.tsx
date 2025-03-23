import { ITeacher } from '../pages/admin/Teacher';
import PaginationButton from './PaginationButton';

interface TeacherTableProps {
  teachers: ITeacher[];
  totalPages: number;
  setSelectedTeacher: (teacher: ITeacher) => void;
  setIsOpen: (isOpen: boolean) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const TeacherTable = ({
  teachers,
  totalPages,
  setSelectedTeacher,
  setIsOpen,
  page,
  setPage,
}: TeacherTableProps) => {
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
                <td className="px-5 py-4 text-center">
                  <button
                    className="btn btn-black btn-sm w-1/2 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeacher(teacher);
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

export default TeacherTable;
