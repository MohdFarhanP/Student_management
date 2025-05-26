import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { socket } from '../../socket';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const NotificationBell = lazy(() => import('../../components/NotificationBell'));
const DashboardStatsCard = lazy(() => import('../../components/DashboardStatsCard'));
const TopClassesCard = lazy(() => import('../../components/TopClassesCard'));
const AttendanceOverviewChart = lazy(() => import('../../components/AttendanceOverviewChart'));
const SendNotification = lazy(() => import('../../components/SendNotification'));

import { UserGroupIcon, AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { getAdminDashboardStats } from '../../api/admin/dashboardApi';
import { fetchClasses, getTopClasses, getWeeklyAttendance } from '../../api/admin/classApi';
import { Unauthorized } from '../Unauthorized';

interface Class {
  _id: string;
  name: string;
}

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

interface TopClass {
  className: string;
  attendancePercentage: number;
}

interface AttendanceData {
  day: string;
  attendance: number;
}

const AdminDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalTeachers: 0, totalClasses: 0 });
  const [topClasses, setTopClasses] = useState<TopClass[]>([]);
  const [weeklyData, setWeeklyData] = useState<AttendanceData[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('User:', user);
    if (!user) return;

    socket.io.opts.query = { userId: user.id };
    socket.connect();

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
    });

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching dashboard data...');
        const statsData = await getAdminDashboardStats();
        setStats(statsData);
        const topClassesData = await getTopClasses();
        setTopClasses(topClassesData!);
        const classesData = await fetchClasses();
        setClasses(classesData!);
        if (classesData!.length > 0) {
          setSelectedClassId(classesData![0]._id);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (selectedClassId) {
      const fetchAttendance = async () => {
        setIsLoading(true);
        setError(null);
        try {
          console.log('Fetching weekly attendance for classId:', selectedClassId);
          const attendanceData = await getWeeklyAttendance(selectedClassId);
          setWeeklyData(attendanceData!);
        } catch (err) {
          console.error('Attendance fetch error:', err);
          setError('Failed to load attendance data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAttendance();
    }
  }, [selectedClassId]);

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'Admin') {
    return (
      <Unauthorized/>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Suspense>
      </ErrorBoundary>
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content dark:text-white sm:text-3xl">
            Admin Dashboard
          </h1>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationBell />
            </Suspense>
          </ErrorBoundary>
        </div>
        {error && (
          <div className="mb-6">
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardStatsCard
                title="Students"
                count={stats.totalStudents}
                icon={<UserGroupIcon className="h-8 w-8 text-blue-600" />}
                bgColor="bg-blue-100 dark:bg-blue-900/30"
              />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardStatsCard
                title="Teachers"
                count={stats.totalTeachers}
                icon={<AcademicCapIcon className="h-8 w-8 text-green-600" />}
                bgColor="bg-green-100 dark:bg-green-900/30"
              />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardStatsCard
                title="Classes"
                count={stats.totalClasses}
                icon={<BuildingOfficeIcon className="h-8 w-8 text-yellow-600" />}
                bgColor="bg-yellow-100 dark:bg-yellow-900/30"
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="mt-6">
          {classes.length > 0 && (
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Class
                </label>
                <select
                  value={selectedClassId || ''}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="select select-bordered w-full max-w-xs bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {isLoading ? <LoadingSpinner /> : <AttendanceOverviewChart data={weeklyData} />}
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {isLoading ? <LoadingSpinner /> : <TopClassesCard data={topClasses} />}
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SendNotification />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;