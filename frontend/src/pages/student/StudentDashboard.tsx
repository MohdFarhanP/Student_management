import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { lazy } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { fetchTimetableForToday } from '../../api/admin/timeTableApi';
import { TimetableSlot } from '../../types/timetable';
import { getStdLiveSessions, ILiveSessions } from '../../api/admin/studentApi';
import { getClassesById, IClassData } from '../../api/admin/classApi';
import { toast } from 'react-toastify';
import { Unauthorized } from '../Unauthorized';

// Lazy load components
const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));
const MyClassInfo = lazy(() => import('../../components/MyClassInfo'));
const LiveSessions = lazy(() => import('../../components/LiveSessions'));
const TodaysTimetable = lazy(() => import('../../components/TodaysTimetable'));
const NotificationBell = lazy(() => import('../../components/NotificationBell'));

export const StudentDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [classInfo, setClassInfo] = useState<IClassData | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [liveSessions, setLiveSessions] = useState<ILiveSessions[]>([]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const classData = await getClassesById(user.id);
      if (!classData || !classData.id) {
        throw new Error('Invalid class data');
      }
      setClassInfo(classData);

      
      const [timetableData, sessionsData] = await Promise.all([
        fetchTimetableForToday(classData.id),
        getStdLiveSessions(user.id),
      ]);

      setTimetable(timetableData!);
      setLiveSessions(sessionsData!);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Unauthorized/>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content ml-15 dark:text-white sm:text-3xl">
            Student Dashboard
          </h1>
          <Suspense fallback={<div className="p-2">Loading...</div>}>
            <NotificationBell />
          </Suspense>
        </div>

        <div className="space-y-6">
          {/* Top Grid: MyClassInfo and LiveSessions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {classInfo && (
              <Suspense fallback={<div className="p-4">Loading Class Info...</div>}>
                <MyClassInfo {...classInfo} />
              </Suspense>
            )}
            <Suspense fallback={<div className="p-4">Loading Live Sessions...</div>}>
              <LiveSessions sessions={liveSessions} />
            </Suspense>
          </div>
          {/* Full-Width Timetable */}
          <div className="w-full">
            <Suspense fallback={<div className="p-4">Loading Timetable...</div>}>
              <TodaysTimetable periods={timetable || []} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};