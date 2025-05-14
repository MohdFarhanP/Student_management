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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <StudentSidebar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <NotificationBell />
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {classInfo && <MyClassInfo {...classInfo} />}
          <LiveSessions sessions={liveSessions} />
        </div>

        <TodaysTimetable periods={timetable || []} />
      </div>
    </div>
  );
};
