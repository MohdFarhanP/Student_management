import { IClassData } from '../api/adminApi';
import EditClassModal from './EditClassModal';

interface UserTableProps {
  data?: IClassData[];
}

const UserTable = ({ data = [] }: UserTableProps) => {
  if (!data || data.length === 0) {
    return (
      <p className="mt-4 text-center text-lg font-semibold text-gray-500">
        No classes available.
      </p>
    );
  }

  return (
    <div className="relative mx-auto mt-6 max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Table */}
      <table className="w-full table-auto border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-100 text-gray-700">
          <tr className="text-sm font-semibold uppercase">
            <th className="px-5 py-3 text-left">Class Name</th>
            <th className="px-5 py-3 text-left">Room No</th>
            <th className="px-5 py-3 text-left">Total Students</th>
            <th className="px-5 py-3 text-left">Grade</th>
            <th className="px-5 py-3 text-left">Tutor</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {data.map((cls: IClassData) => (
            <tr
              key={cls.id}
              className="transition duration-200 hover:bg-gray-50"
            >
              <td className="px-5 py-4 text-gray-900">{cls.name}</td>
              <td className="px-5 py-4 text-gray-700">{cls.roomNo}</td>
              <td className="px-5 py-4 text-gray-700">{cls.totalStudents}</td>
              <td className="px-5 py-4 text-gray-700">{cls.grade}</td>
              <td className="px-5 py-4 text-gray-700">{cls.tutor}</td>
              <td className="px-5 py-4 text-center">
                <EditClassModal classData={cls} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
