import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../redux/store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  TableCellsIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface AdminSideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-6 w-6" />, path: '/admin/dashboard' },
    { name: 'Students', icon: <UserGroupIcon className="h-6 w-6" />, path: '/admin/students' },
    { name: 'Teachers', icon: <AcademicCapIcon className="h-6 w-6" />, path: '/admin/teachers' },
    { name: 'Class', icon: <BuildingOfficeIcon className="h-6 w-6" />, path: '/admin/class' },
    { name: 'Subject', icon: <BookOpenIcon className="h-6 w-6" />, path: '/admin/subject' },
    { name: 'TimeTable', icon: <TableCellsIcon className="h-6 w-6" />, path: '/admin/timetable' },
    { name: 'Payment', icon: <BanknotesIcon className="h-6 w-6" />, path: '/admin/payment' },
  ];

  
  return (
    <>
      {/* Hamburger Menu Button with Logo for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-1 bg-gray-900 dark:bg-gray-800 rounded-full border border-white dark:border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/favIcon.jpg"
          alt="Logo"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 top-0 left-0 h-screen md:h-auto w-64 md:w-64 flex flex-col justify-between bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 shadow-lg transition-transform duration-300 z-40 md:z-auto overflow-y-auto`}
      >
        <div>
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center space-x-3">
              <img
                src="/favIcon.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-full border border-white dark:border-gray-300 object-cover"
              />
              <p className="text-base font-semibold">STM</p>
            </div>
            <button
              className="p-1 md:hidden text-white dark:text-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="h-px bg-gray-600 dark:bg-gray-500 mx-4"></div>
          <ul className="mt-4 space-y-2 px-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-md px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-primary text-white dark:bg-primary dark:text-gray-100'
                      : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white dark:hover:text-gray-100'
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
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSideBar;