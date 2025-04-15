import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAttendance } from '../../redux/slices/attendanceSlice';
import type { AppDispatch } from '../../redux/store';
import StudentSidebar from '../../components/StudentSidebar';

// Define Attendance interface
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

// Define state interfaces
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

  // State for filters
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'present' | 'absent'
  >('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAttendance(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate summary stats
  const totalRecords = data.length;
  const presentCount = data.filter(
    (record) => record.status === 'present'
  ).length;
  const absentCount = data.filter(
    (record) => record.status === 'absent'
  ).length; // Now used
  const attendancePercentage = totalRecords
    ? ((presentCount / totalRecords) * 100).toFixed(1)
    : '0.0';

  // Filter data based on status and date
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
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="ml-70 flex-1 p-4 sm:p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-800 sm:mb-6 sm:text-2xl">
          Attendance
        </h1>

        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-lg font-semibold text-gray-800">
              {totalRecords}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-lg font-semibold text-green-600">
              {presentCount}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Absent</p>
            <p className="text-lg font-semibold text-red-600">
              {absentCount}
            </p>{' '}
            {/* Now used */}
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Attendance %</p>
            <p className="text-lg font-semibold text-blue-600">
              {attendancePercentage}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row">
          <select
            className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'present' | 'absent')
            }
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <input
            type="date"
            className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Attendance Records */}
        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((record, index) => (
              <div
                key={`${record.studentId}-${record.date.toISOString()}-${record.period}-${index}`}
                className="flex flex-col rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm font-medium text-gray-800">
                    {record.date instanceof Date &&
                    !isNaN(record.date.getTime())
                      ? record.date.toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">{record.day}</p>
                </div>
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    Period: {record.period}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                No attendance records found for the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentAttendanceView);
