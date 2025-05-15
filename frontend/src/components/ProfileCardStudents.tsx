import React from 'react';
import profile from '../assets/profile.jpg';
import { IStudent } from '../api/admin/studentApi';

interface ProfileCardProps {
  selectedStudent: IStudent;
}

const ProfileCardStudents: React.FC<ProfileCardProps> = ({
  selectedStudent,
}) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4 w-full">
      {/* Profile Image */}
      <div className="mb-3 flex flex-col items-center">
        <img
          src={selectedStudent.profileImage || profile}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
          alt="Profile"
        />
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
          {selectedStudent.email}
        </p>
        <h2 className="mt-1 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {selectedStudent.name}
        </h2>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <div>
          <p className="font-semibold">Age:</p>
          <p>{selectedStudent.age}</p>
        </div>
        <div>
          <p className="font-semibold">Roll No:</p>
          <p>{selectedStudent.roleNumber || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Gender:</p>
          <p>{selectedStudent.gender}</p>
        </div>
        <div>
          <p className="font-semibold">DOB:</p>
          <p>{selectedStudent.dob || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Class:</p>
          <p>{selectedStudent.class || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Subjects:</p>
          <p>{selectedStudent.subjectIds?.length || 0}</p>
        </div>
      </div>

      {/* Address Details */}
      <h3 className="mt-3 text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
        Address
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <div>
          <p className="font-semibold">House:</p>
          <p>{selectedStudent.address?.houseName || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Place:</p>
          <p>{selectedStudent.address?.place || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">District:</p>
          <p>{selectedStudent.address?.district || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Pincode:</p>
          <p>{selectedStudent.address?.pincode || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold">Phone:</p>
          <p>{selectedStudent.address?.phoneNo || 'N/A'}</p>
        </div>
      </div>

      {/* Guardian Details */}
      <h3 className="mt-3 text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
        Guardian
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{selectedStudent.address?.guardianName || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Contact:</p>
          <p>{selectedStudent.address?.guardianContact || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardStudents;