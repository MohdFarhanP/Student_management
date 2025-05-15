import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import TeacherSidebar from '../../components/TeacherSidebar';
import NotificationBell from '../../components/NotificationBell';
import MyClassesSubjects from '../../components/MyClassesSubjects';
import TodaySchedule from '../../components/TodaySchedule';
import MyLiveSessions from '../../components/MyLiveSessions';
import { toast } from 'react-toastify';
import { getTeacherClasses, getTodaySchedule, getLiveSessions } from '../../api/admin/teacherApi';

interface ClassSubject {
  className: string;
  subject: string;
  classId: string;
}

interface Schedule {
  period: number;
  subject: string;
  className: string;
}

interface Session {
  title: string;
  className: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}

const TeacherDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [classes, setClasses] = useState<ClassSubject[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [classesData, scheduleData, sessionsData] = await Promise.all([
        getTeacherClasses(),
        getTodaySchedule(),
        getLiveSessions(),
      ]);
      setClasses(classesData!);
      setSchedule(scheduleData!);
      setSessions(sessionsData!);
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

  if (!user || user.role !== 'Teacher') {
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Unauthorized</span>
          </div>
        </div>
      </div>
    );
  }

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
      <TeacherSidebar />
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-base-content ml-15 dark:text-white sm:text-2xl">
            Teacher Dashboard
          </h1>
          <NotificationBell />
        </div>
        <div className="space-y-6">
          {/* Top Grid: MyClassesSubjects and TodaySchedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MyClassesSubjects data={classes} />
            <TodaySchedule data={schedule} />
          </div>
          {/* Full-Width MyLiveSessions */}
          <div className="w-full">
            <MyLiveSessions sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;