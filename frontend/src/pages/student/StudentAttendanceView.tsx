import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance } from '../../redux/slices/attendanceSlice';
import type { AppDispatch } from '../../redux/store';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load components
const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));

interface Attendance {
  classId: string;
  studentId: string;
  date: Date;
  period: number;
  status: 'present' | 'absent';
  day: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AttendanceState {
  data: Attendance[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  attendance: AttendanceState;
  auth: { user: { id: string } };
}

const StudentAttendanceView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.attendance
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'present' | 'absent'
  >('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAttendance(user.id));
    }
  }, [dispatch, user?.id]);

  const totalRecords = data.length;
  const presentCount = data.filter(
    (record) => record.status === 'present'
  ).length;
  const absentCount = data.filter(
    (record) => record.status === 'absent'
  ).length;
  const attendancePercentage = totalRecords
    ? ((presentCount / totalRecords) * 100).toFixed(1)
    : '0.0';

  const filteredData = data.filter((record) => {
    const matchesStatus =
      statusFilter === 'all' || record.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      new Date(record.date).toLocaleDateString().includes(dateFilter);
    return matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>error</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-45">
        <h1 className="text-xl sm:text-2xl lg:text-3xl pl-[50px] sm:pl-0 font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
          Attendance
        </h1>

        <ErrorBoundary>
          <div className="grid grid-cols-1 mt-6 sm:mt-0 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{totalRecords}</p>
            </div>
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-500">{presentCount}</p>
            </div>
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-500">{absentCount}</p>
            </div>
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance %</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-500">{attendancePercentage}%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
            <select
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'present' | 'absent')}
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
            <input
              type="date"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <div
                  key={`${record.studentId}-${record.date.toISOString()}-${record.period}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {record.date instanceof Date && !isNaN(record.date.getTime())
                        ? record.date.toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{record.day}</p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Period: {record.period}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-white dark:bg-gray-800 p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No attendance records found for the selected filters.
                </p>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default React.memo(StudentAttendanceView);