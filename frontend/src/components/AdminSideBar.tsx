import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdDashboard, MdPeople, MdSchool, MdLogout } from 'react-icons/md';
import { GiNotebook } from 'react-icons/gi';
import { FaSchool } from 'react-icons/fa';
import { adminLogout } from '../api/adminApi';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { BsTable } from 'react-icons/bs';

const AdminSideBar = () => {
  const [active, setActive] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    await adminLogout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <MdDashboard size={22} />,
      path: '/admin/dashboard',
    },
    {
      name: 'Students',
      icon: <MdPeople size={22} />,
      path: '/admin/students',
    },
    {
      name: 'Teachers',
      icon: <MdSchool size={22} />,
      path: '/admin/teachers',
    },
    {
      name: 'Class',
      icon: <FaSchool size={22} />,
      path: '/admin/class',
    },
    {
      name: 'Subject',
      icon: <GiNotebook size={22} />,
      path: '/admin/subject',
    },
    {
      name: 'TimeTable',
      icon: <BsTable size={22} />,
      path: '/admin/timetable',
    },
  ];

  return (
    <div className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between bg-black text-white shadow-lg md:relative">
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-center py-6">
          <img src="/logo.png" alt="Logo" className="w-36" />
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-4 space-y-2 px-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setActive(item.path);
              }}
              className={`flex cursor-pointer items-center space-x-3 rounded-md px-4 py-3 transition ${active === item.path ? 'bg-white text-black' : 'hover:bg-white hover:text-black'} `}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
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

export default AdminSideBar;
