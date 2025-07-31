import { useState } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import LeaveManagement from '../../components/LeaveManagement';

const StudentLeavePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar for Desktop */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold ml-12 text-base-content dark:text-white">
            Leave Management
          </h2>
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
      <div className="drawer-side">
        <label htmlFor="student-drawer" className="drawer-overlay"></label>
        <div className="bg-base-200 dark:bg-gray-800 h-full">
          <StudentSidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentLeavePage;