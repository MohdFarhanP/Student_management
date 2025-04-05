import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.student.profile) ?? null;

  const defaultImage =
    'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=';

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-black p-4 text-white shadow-lg">
      <div
        className="mb-6 flex cursor-pointer items-center"
        onClick={() => navigate('/student/profile')}
      >
        <img
          src={profile?.profileImage || defaultImage}
          alt="Profile"
          className="mb-2 h-12 w-12 rounded-full border-1 border-white object-cover"
        />
        <h2 className="ml-6 pb-5 text-lg font-semibold">
          {profile?.name || 'Student'}
        </h2>
      </div>
      <div className="border-t border-gray-600 mb-4"></div>
      <nav className="space-y-2">
        <Link
          to="/student/classes"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          Classes
        </Link>
        <Link
          to="/student/schedule"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          Schedule
        </Link>
        <Link
          to="/student/settings"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default StudentSidebar;