import React from 'react';
import { IClassData } from '../api/admin/classApi';
import {
  BookOpenIcon,
  TagIcon,
  AcademicCapIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

const MyClassInfo: React.FC<IClassData> = ({ name, section, grade, roomNo }) => {
  const items = [
    {
      label: 'Class',
      value: name,
      icon: <BookOpenIcon className="h-6 w-6 text-primary dark:text-primary-content" />,
    },
    {
      label: 'Section',
      value: section || 'N/A',
      icon: <TagIcon className="h-6 w-6 text-primary dark:text-primary-content" />,
    },
    {
      label: 'Grade',
      value: grade || 'N/A',
      icon: <AcademicCapIcon className="h-6 w-6 text-primary dark:text-primary-content" />,
    },
    {
      label: 'RoomNo',
      value: roomNo,
      icon: <IdentificationIcon className="h-6 w-6 text-primary dark:text-primary-content" />,
    },
  ];

  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
          My Class
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center gap-3"
            >
              {item.icon}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-sm text-base-content dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyClassInfo;