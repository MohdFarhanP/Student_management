import { IStudent } from '../api/admin/studentApi';
import { ITeacher } from '../pages/admin/Teacher';
import profile from '../assets/profile.jpg';
import React from 'react';

interface ProfileCardProps<T> {
  selectedItem: T | null;
  renderDetails: (item: T) => React.ReactNode;
}

const StudentTeacherProfileCard = <T extends ITeacher | IStudent>({
  selectedItem,
  renderDetails,
}: ProfileCardProps<T>) => {
  if (!selectedItem) {
    return (
      <div className="card bg-base-100 w-full rounded-lg border border-gray-200 p-4 text-center text-gray-500 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        No profile selected.
      </div>
    );
  }
  return (
    <div className="card bg-base-100 w-full rounded-lg border border-gray-200 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Profile Image */}
      <div className="mb-3 flex flex-col items-center">
        <img
          src={selectedItem.profileImage || profile}
          className="h-16 w-16 rounded-full border border-gray-300 object-cover sm:h-20 sm:w-20 dark:border-gray-600"
          alt="Profile"
        />
        <p className="mt-2 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
          {selectedItem.email}
        </p>
        <h2 className="mt-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100">
          {selectedItem.name}
        </h2>
      </div>

      {/* Teacher Details */}
      <div className="text-xs text-gray-700 sm:text-sm dark:text-gray-300">
        {renderDetails(selectedItem)}
      </div>
    </div>
  );
};

export default StudentTeacherProfileCard;
