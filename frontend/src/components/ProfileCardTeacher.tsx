import React from 'react';
import profile from '../assets/profile.jpg';
import { ITeacher } from '../pages/admin/Teacher';

interface ProfileCardProps {
  selectedTeacher: ITeacher;
}

const ProfileCardTeacher: React.FC<ProfileCardProps> = ({ selectedTeacher }) => {
  return (
    <div className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      {/* Profile Image */}
      <div className="mb-3 flex flex-col items-center">
        <img
          src={selectedTeacher.profileImage || profile}
          className="h-20 w-20 rounded-full border border-gray-300 object-cover"
        />
        <h2 className="mt-1 text-lg font-semibold text-gray-800">
          {selectedTeacher.name}
        </h2>
      </div>

      {/* Teacher Details */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
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
        <div className="col-span-2">
          <p className="font-semibold">Specialization:</p>
          <p>{selectedTeacher.specialization || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Experience (Years):</p>
          <p>{selectedTeacher.experienceYears || 0}</p>
        </div>
        <div>
          <p className="font-semibold">Qualification:</p>
          <p>{selectedTeacher.qualification || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardTeacher;