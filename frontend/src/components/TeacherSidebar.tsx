import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { MdLogout } from 'react-icons/md';
import defaultImage from '../assets/profile.jpg';
import SendNotificationModal from './SendNotificationModal';

const TeacherSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const profile =
    useSelector((state: RootState) => state.teacher.profile) ?? null;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.log(err);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-black p-4 text-white shadow-lg">
      {/* Profile Image */}
      <div
        className="mb-6 flex cursor-pointer items-center"
        onClick={() => navigate('/teacher/profile')}
      >
        <img
          src={profile?.profileImage || defaultImage}
          alt="Profile"
          className="mb-2 h-15 w-15 rounded-full border-1 border-white object-cover"
        />
        <h2 className="ml-6 pb-5 text-lg font-semibold">
          {profile?.name || 'Teacher'}
        </h2>
      </div>

      <div className="divider"></div>

      {/* Sidebar Navigation */}
      <nav className="space-y-2">
        <Link
          to="/teacher/Attendance"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          Attendance
        </Link>
        <Link
          to="/teacher/chat"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          Chat
        </Link>
        <SendNotificationModal
          trigger={
            <button className="block w-full rounded p-2 text-left hover:bg-white hover:font-medium hover:text-black">
              Send Notification
            </button>
          }
        />
        <Link
          to="/teacher/notes"
          className="block rounded p-2 hover:bg-white hover:font-medium hover:text-black"
        >
          notes
        </Link>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center space-x-2 rounded-md bg-red-600 px-4 py-3 text-sm font-medium transition hover:bg-red-700"
        >
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
