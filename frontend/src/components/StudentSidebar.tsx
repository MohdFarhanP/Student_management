import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { MdLogout, MdEventAvailable, MdChat, MdSettings } from 'react-icons/md';
import defaultImage from '../assets/profile.jpg';

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profile =
    useSelector((state: RootState) => state.student.profile) ?? null;

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

  const menuItems = [
    {
      name: 'Attendance',
      icon: <MdEventAvailable size={22} />,
      path: '/student/attendance',
    },
    {
      name: 'Chat',
      icon: <MdChat size={22} />,
      path: '/student/chat',
    },
    {
      name: 'Settings',
      icon: <MdSettings size={22} />,
      path: '/student/settings',
    },
  ];

  return (
    <div className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between bg-black text-white shadow-lg">
      <div>
        <div className="flex items-center justify-center py-6">
          <img
            src={profile?.profileImage || defaultImage}
            alt="Profile"
            className="h-12 w-12 rounded-full border border-white object-cover"
          />
          <p className="ml-2 text-lg font-semibold">
            {profile?.name || 'Student'}
          </p>
        </div>
        <div className="divider"></div>
        <ul className="mt-4 space-y-2 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-md px-4 py-3 transition ${
                  isActive
                    ? 'bg-white text-black'
                    : 'hover:bg-white hover:text-black'
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </ul>
      </div>
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

export default StudentSidebar;
