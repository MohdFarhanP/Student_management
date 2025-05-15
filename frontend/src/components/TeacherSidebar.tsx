import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { MdLogout, MdEventAvailable, MdChat, MdClose, MdDashboard } from 'react-icons/md';
import defaultImage from '../assets/profile.jpg';
import { FaRegNoteSticky } from "react-icons/fa6";
import { RiLiveFill } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";

const TeacherSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.teacher.profile) ?? null;
  const [isOpen, setIsOpen] = useState(false);

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
      name: 'Dashboard',
      icon: <MdDashboard size={22} />,
      path: '/teacher/dashboard',
    },
    {
      name: 'Profile',
      icon: <MdEventAvailable size={22} />,
      path: '/teacher/profile',
    },
    {
      name: 'Attendance',
      icon: <MdEventAvailable size={22} />,
      path: '/teacher/Attendance',
    },
    {
      name: 'Chat',
      icon: <MdChat size={22} />,
      path: '/teacher/chat',
    },
    {
      name: 'Notes',
      icon: <FaRegNoteSticky size={22} />,
      path: '/teacher/notes',
    },
    {
      name: 'Leave Management',
      icon: <FaRegCalendarAlt size={22} />,
      path: '/teacher/leave/teacher',
    },
    {
      name: 'LiveSessions',
      icon: <RiLiveFill  size={22} />,
      path: '/teacher/live-session',
    },
  ];

  return (
    <>
      {/* Hamburger Menu Button with Profile Picture for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-1 bg-black dark:bg-gray-800 rounded-full border border-white dark:border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={profile?.profileImage || defaultImage}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col justify-between bg-black dark:bg-gray-800 text-white dark:text-gray-100 shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static z-40`}
      >
        <div>
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center space-x-3">
              <img
                src={profile?.profileImage || defaultImage}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-white dark:border-gray-300 object-cover"
              />
              <p className="text-base font-semibold truncate">
                {profile?.name || 'Teacher'}
              </p>
            </div>
            <button
              className="p-1 lg:hidden text-white dark:text-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <MdClose size={20} />
            </button>
          </div>
          <div className="h-px bg-gray-600 dark:bg-gray-500 mx-4"></div>
          <ul className="mt-4 space-y-2 px-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path || '/teacher/profile'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-md px-4 py-3 transition ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-black dark:text-gray-100'
                      : 'hover:bg-white dark:hover:bg-gray-700 hover:text-black dark:hover:text-gray-100'
                  }`
                }
                onClick={() => setIsOpen(false)}
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
            className="flex w-full items-center justify-center space-x-2 rounded-md bg-red-600 dark:bg-red-500 px-4 py-3 text-sm font-medium transition hover:bg-red-700 dark:hover:bg-red-600"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default TeacherSidebar;