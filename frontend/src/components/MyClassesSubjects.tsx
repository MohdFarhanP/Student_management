import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

interface ClassSubject {
  className: string;
  subject: string;
}

interface MyClassesSubjectsProps {
  data: ClassSubject[];
}

const MyClassesSubjects: React.FC<MyClassesSubjectsProps> = ({ data }) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
          My Classes / Subjects
        </h2>
        {data.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No classes assigned.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <BookOpenIcon className="h-6 w-6 text-primary dark:text-primary-content" />
                <div className="flex-1 flex justify-between items-center">
                  <span className="font-medium text-base-content dark:text-white">
                    {item.className}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.subject}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyClassesSubjects;