import React, { memo, lazy, Suspense } from 'react';
import { IClassData } from '../api/admin/classApi';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { PencilIcon } from '@heroicons/react/24/outline';

// Lazy-load EditClassModal
const EditClassModal = lazy(() => import('./EditClassModal'));

interface UserTableProps {
  data?: IClassData[];
}

const ClassTable: React.FC<UserTableProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
        No classes available.
      </p>
    );
  }

  // Memoized ClassCard to prevent unnecessary re-renders
  const ClassCard = memo(({ cls }: { cls: IClassData }) => (
    <div
      className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center p-4 gap-4">
        {/* Icon (Class Placeholder) */}
        <div className="avatar">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-500 dark:text-gray-300">
              {cls.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Class Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {cls.name}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm mt-1">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Room No:</span>
              <span className="text-gray-700 dark:text-gray-200">{cls.roomNo}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Students:</span>
              <span className="text-gray-700 dark:text-gray-200">{cls.totalStudents}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Grade:</span>
              <span className="text-gray-700 dark:text-gray-200">{cls.grade}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Tutor:</span>
              <span className="text-gray-700 dark:text-gray-200">{cls.tutor}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <EditClassModal
                classData={cls}
                button={
                  <button
                    className="btn btn-ghost btn-sm rounded-full tooltip"
                    data-tip="Edit"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                }
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="space-y-3">
      {data.map((cls: IClassData) => (
        <ClassCard key={cls.id} cls={cls} />
      ))}
    </div>
  );
};

export default memo(ClassTable);