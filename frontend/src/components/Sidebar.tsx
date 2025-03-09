import { useState } from 'react';
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Class Management', path: '/admin/class', icon: <FiUser /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  return (
    <div
      className={`m-3 h-[calc(100vh-1.5rem)] rounded-lg bg-white p-5 pt-8 text-black shadow-lg ${
        isOpen ? 'w-60' : 'w-21'
      } duration-300`}
    >
      <button
        className="ml-1 rounded-full bg-white p-2 text-gray-700 hover:border hover:border-[#F6F6F6]"
        onClick={toggleSidebar}
      >
        <FiMenu />
      </button>

      <div className="divider"></div>

      <div className="mt-8 flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex items-center gap-4 rounded-md p-3 hover:bg-[#F6F6F6]"
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`${!isOpen && 'hidden'} duration-200`}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-5 flex cursor-pointer items-center gap-4 rounded-md p-3 hover:bg-[#F6F6F6]">
        <FiLogOut className="text-xl" />
        <span className={`${!isOpen && 'hidden'} duration-200`}>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
