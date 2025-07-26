import React from 'react'
import { ISubject } from '../api/admin/subjectApi';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
interface SubjectCardProps {
  subject: ISubject;
  handleEditSubject: (subject: ISubject) => void;
  handleDeleteSubject: (subjectId: string) => void;
}
const SubjectCard = ({ subject,handleEditSubject,handleDeleteSubject }:SubjectCardProps) => {
  return (
    <div
      className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="p-4">
        {/* Subject Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {subject.subjectName}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm rounded-full tooltip"
              data-tip="Edit"
              onClick={() => handleEditSubject(subject)}
            >
              <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              className="btn btn-ghost btn-sm rounded-full tooltip"
              data-tip="Delete"
              onClick={() => handleDeleteSubject(subject.id)}
            >
              <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Notes
          </h3>
          {Array.isArray(subject.notes) && subject.notes.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {subject.notes.map((note, index) => (
                <img
                  key={index}
                  src={note}
                  alt="Note"
                  className="h-10 w-10 rounded-md object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notes available
            </p>
          )}
        </div>

        {/* Teachers */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Teachers
          </h3>
          {Array.isArray(subject.teachers) && subject.teachers.length > 0 ? (
            <ul className="mt-1 max-h-20 overflow-y-auto text-sm text-gray-600 dark:text-gray-400">
              {subject.teachers.map((teacher, index) => (
                <li key={index} className="truncate">
                  {typeof teacher === 'string' ? teacher : teacher.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No teachers assigned
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SubjectCard);
