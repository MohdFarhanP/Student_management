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
import { getStudentsIdByClass } from '../../api/admin/classApi';
import { socket } from '../../socket';
import { v4 as uuidv4 } from 'uuid';

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
    return <div className="p-6 text-red-600">Unauthorized</div>;
  }

  return (
    <div className="flex bg-white min-h-screen">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          <NotificationBell />
        </div>
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <MyClassesSubjects data={classes} />
          <TodaySchedule data={schedule} />
        </div>
        <div className="p-6">
          <MyLiveSessions sessions={sessions} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;