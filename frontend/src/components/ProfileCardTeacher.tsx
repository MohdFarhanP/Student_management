import React, { memo } from 'react';
import profile from '../assets/profile.jpg';
import { ITeacher } from '../pages/admin/Teacher';

interface ProfileCardProps {
  selectedTeacher: ITeacher;
}

const ProfileCardTeacher: React.FC<ProfileCardProps> = ({
  selectedTeacher,
}) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4 w-full">
      {/* Profile Image */}
      <div className="mb-3 flex flex-col items-center">
        <img
          src={selectedTeacher.profileImage || profile}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
          alt="Profile"
        />
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
          {selectedTeacher.email}
        </p>
        <h2 className="mt-1 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {selectedTeacher.name}
        </h2>
      </div>

      {/* Teacher Details */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <div>
          <p className="font-semibold">Employee ID:</p>
          <p>{selectedTeacher.empId}</p>
        </div>
        <div>
          <p className="font-semibold">Gender:</p>
          <p>{selectedTeacher.gender}</p>
        </div>
        <div>
          <p className="font-semibold">DOB:</p>
          <p>{selectedTeacher.dateOfBirth || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Phone:</p>
          <p>{selectedTeacher.phoneNo || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Assigned Class:</p>
          <p>{selectedTeacher.assignedClass || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Subject:</p>
          <p>{selectedTeacher.subject || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Experience (Years):</p>
          <p>{selectedTeacher.experienceYears || 0}</p>
        </div>
        <div>
          <p className="font-semibold">Qualification:</p>
          <p>{selectedTeacher.qualification || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold">Specialization:</p>
          <p>{selectedTeacher.specialization || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileCardTeacher);