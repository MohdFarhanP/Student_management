import { useState } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import LeaveManagement from '../../components/LeaveManagement';

const StudentLeavePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Drawer for Mobile */}
      <div className="drawer lg:hidden">
        <input id="student-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Drawer Toggle Button */}
          <label
            htmlFor="student-drawer"
            className="btn btn-ghost btn-circle fixed top-4 left-4 z-50 lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen">
            <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
                Leave Management
              </h1>
            </div>

            {/* Tabs */}
            <div className="tabs mb-6">
              <button
                className={`tab tab-lg tab-lifted ${
                  activeTab === 'apply' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('apply')}
              >
                Apply for Leave
              </button>
              <button
                className={`tab tab-lg tab-lifted ${
                  activeTab === 'history' ? 'tab-active' : ''
                }`}
                onClick={() => setActiveTab('history')}
              >
                Leave History
              </button>
            </div>

            {/* Leave Management Component */}
            <LeaveManagement mode={activeTab} />
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="student-drawer" className="drawer-overlay"></label>
          <div className="bg-base-200 dark:bg-gray-800 h-full">
            <StudentSidebar />
          </div>
        </div>
      </div>

      {/* Main Content for Desktop */}
      <div className="hidden lg:flex lg:flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen">
        <div className="flex-1">
          <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
              Leave Management
            </h1>
          </div>

          {/* Tabs */}
          <div className="tabs mb-6">
            <button
              className={`tab tab-lg tab-lifted ${
                activeTab === 'apply' ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab('apply')}
            >
              Apply for Leave
            </button>
            <button
              className={`tab tab-lg tab-lifted ${
                activeTab === 'history' ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab('history')}
            >
              Leave History
            </button>
          </div>

          {/* Leave Management Component */}
          <LeaveManagement mode={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default StudentLeavePage;