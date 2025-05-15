import React, { useCallback, useEffect, useState } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import LiveSessions from '../../components/LiveSessions';
import TodaysTimetable from '../../components/TodaysTimetable';
import MyClassInfo from '../../components/MyClassInfo';
import NotificationBell from '../../components/NotificationBell';
import { getClassesById, IClassData } from '../../api/admin/classApi';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { fetchTimetableForToday } from '../../api/admin/timeTableApi';
import { TimetableSlot } from '../../types/timetable';
import { getStdLiveSessions, ILiveSessions } from '../../api/admin/studentApi';
import { toast } from 'react-toastify';

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
      setClassInfo(classData!);

      const [timetableData, sessionsData] = await Promise.all([
        fetchTimetableForToday(classData!.id),
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
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <div className="alert alert-error shadow-lg max-w-md">
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
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <StudentSidebar />
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content ml-15 dark:text-white sm:text-3xl">
            Student Dashboard
          </h1>
          <NotificationBell />
        </div>

        <div className="space-y-6">
          {/* Top Grid: MyClassInfo and LiveSessions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {classInfo && <MyClassInfo {...classInfo} />}
            <LiveSessions sessions={liveSessions} />
          </div>
          {/* Full-Width Timetable */}
          <div className="w-full">
            <TodaysTimetable periods={timetable || []} />
          </div>
        </div>
      </div>
    </div>
  );
};