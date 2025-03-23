import React from 'react';
import profile from '../assets/profile.jpg';
import { IStudent } from '../pages/admin/Student';

interface ProfileCardProps {
  selectedStudent: IStudent;
}

const ProfileCardStudents: React.FC<ProfileCardProps> = ({
  selectedStudent,
}) => {
  return (
    <div className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      {/* Profile Image */}
      <div className="mb-3 flex flex-col items-center">
        <img
          src={selectedStudent.profileImage || profile}
          className="h-20 w-20 rounded-full border border-gray-300 object-cover"
        />
        <h2 className="mt-1 text-lg font-semibold text-gray-800">
          {selectedStudent.name}
        </h2>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
        <div>
          <p className="font-semibold">Age:</p>
          <p>{selectedStudent.age}</p>
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
        <div className="col-span-2">
          <p className="font-semibold">Subjects:</p>
          <p>{selectedStudent.subjectIds?.length || 0}</p>
        </div>
      </div>

      {/* Address Details */}
      <h3 className="mt-3 text-sm font-semibold text-gray-800">Address</h3>
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
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
      <h3 className="mt-3 text-sm font-semibold text-gray-800">Guardian</h3>
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
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
