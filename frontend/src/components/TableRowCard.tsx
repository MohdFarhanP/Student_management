import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import profile from '../assets/profile.jpg';
import { IStudent } from '../api/admin/studentApi';
import { ITeacher } from '../pages/admin/Teacher';

interface TableRowCardProps<T> {
  data: T[];
  setSelectedItem: (item: T) => void;
  handleEdit: (item: T) => void;
  handleDelete: (id: string) => void;
}

const TableRowCard = <T extends IStudent | ITeacher>({
  data,
  setSelectedItem,
  handleEdit,
  handleDelete,
}: TableRowCardProps<T>) => {
  function isStudent(item: IStudent | ITeacher): item is IStudent {
    return 'roleNumber' in item;
  }

  return (
    <div>
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={isStudent(item) ? item.roleNumber : item.empId}
            className="card bg-base-100 cursor-pointer rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Avatar */}
              <div className="avatar">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                  <img
                    src={item.profileImage || profile}
                    alt={item.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {item.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Age:
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {item.age}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Gender:
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {item.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Class:
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {isStudent(item) ? item.class : item.assignedClass}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm tooltip rounded-full"
                  data-tip="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <PencilIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  className="btn btn-ghost btn-sm tooltip rounded-full"
                  data-tip="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableRowCard;
