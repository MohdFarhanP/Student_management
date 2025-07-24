import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherSidebar = lazy(() => import('../../components/TeacherSidebar'));
const LeaveManagement = lazy(() => import('../../components/LeaveManagement'));

const TeacherLeavePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
        <Suspense fallback={<div><LoadingSpinner/></div>}>
          <TeacherSidebar />
        </Suspense>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-h-screen">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold ml-12 text-base-content dark:text-white">
              Leave Management
            </h2>

            <Suspense fallback={<div>Loading Leave Management...</div>}>
              <LeaveManagement mode="teacher" />
            </Suspense>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TeacherLeavePage;