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
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize Socket.IO
  useEffect(() => {
    if (!user) return;

    socket.io.opts.query = { userId: user.id };
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('live-session-scheduled', (data: { sessionId: string; title: string; scheduledAt: string }) => {
      setLoading(false);
      toast.success(`Session "${data.title}" scheduled for ${new Date(data.scheduledAt).toLocaleString()}`);
      setSessionTitle('');
      setSelectedClassId('');
      setScheduledAt('');
      setStudentIds([]);
      fetchData();
    });

    socket.on('live-session-start', (data: { sessionId: string; title: string }) => {
      setLoading(false);
      toast.info(`Session "${data.title}" has started!`);
      fetchData();
    });

    socket.on('error', (message: string) => {
      setLoading(false);
      toast.error(message);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
      toast.error('Failed to connect to server');
    });

    return () => {
      socket.off('connect');
      socket.off('live-session-scheduled');
      socket.off('live-session-start');
      socket.off('error');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [user]);

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

  useEffect(() => {
    if (selectedClassId) {
      const fetchStudentIds = async () => {
        try {
          const studentIdsData = await getStudentsIdByClass(selectedClassId);
          const ids = Array.isArray(studentIdsData?.studentIds) ? studentIdsData.studentIds : [];
          setStudentIds(ids);
        } catch (err) {
          setError('Failed to load student list: ' + (err instanceof Error ? err.message : String(err)));
          setStudentIds([]);
        }
      };
      fetchStudentIds();
    } else {
      setStudentIds([]);
    }
  }, [selectedClassId]);

  const startSession = async () => {
    if (!user || !sessionTitle || !selectedClassId) {
      toast.error('Please enter a session title and select a class');
      return;
    }

    if (studentIds.length === 0) {
      toast.error('No students found in the selected class');
      return;
    }

    setLoading(true);
    try {
      const sessionId = uuidv4();
      const payload = {
        sessionId,
        title: sessionTitle,
        classId: selectedClassId,
        teacherId: user.id,
        studentIds,
        scheduledAt: new Date().toISOString(), // Immediate session
      };

      console.log('Emitting schedule-live-session (start):', payload);
      socket.emit('schedule-live-session', payload);
    } catch (err) {
      setLoading(false);
      console.error('Start session error:', err);
      toast.error('Failed to start session');
    }
  };

  const scheduleSession = async () => {
    if (!user || !sessionTitle || !selectedClassId || !scheduledAt) {
      toast.error('Please enter a session title, select a class, and select a date/time');
      return;
    }

    if (studentIds.length === 0) {
      toast.error('No students found in the selected class');
      return;
    }

    try {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        toast.error('Invalid date or time');
        return;
      }

      if (scheduledDate.getTime() <= Date.now()) {
        toast.error('Scheduled time must be in the future');
        return;
      }

      setLoading(true);
      const sessionId = uuidv4();
      const payload = {
        sessionId,
        title: sessionTitle,
        classId: selectedClassId,
        teacherId: user.id,
        studentIds,
        scheduledAt: scheduledDate.toISOString(),
      };

      console.log('Emitting schedule-live-session (schedule):', payload);
      socket.emit('schedule-live-session', payload);
    } catch (err) {
      setLoading(false);
      console.error('Schedule session error:', err);
      toast.error('Failed to schedule session');
    }
  };

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
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Start or Schedule a Live Session</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="classSelect" className="block text-sm font-medium text-gray-600">
                  Select Class
                </label>
                <select
                  id="classSelect"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Class</option>
                  {classes.length === 0 ? (
                    <option value="" disabled>
                      No classes available
                    </option>
                  ) : (
                    classes.map((cls) => (
                      <option key={cls.classId} value={cls.classId}>
                        {cls.className}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="sessionTitle" className="block text-sm font-medium text-gray-600">
                  Session Title
                </label>
                <input
                  id="sessionTitle"
                  type="text"
                  placeholder="e.g., Math Class - Algebra Basics"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-600">
                  Schedule Date & Time (Optional)
                </label>
                <input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={startSession}
                  disabled={loading || !selectedClassId || !sessionTitle || studentIds.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Start Session Now
                </button>
                <button
                  onClick={scheduleSession}
                  disabled={loading || !scheduledAt || !selectedClassId || !sessionTitle || studentIds.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                  Schedule for Later
                </button>
              </div>
            </div>
          </div>
          <MyLiveSessions sessions={sessions} onScheduleNew={() => setSelectedClassId('')} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;