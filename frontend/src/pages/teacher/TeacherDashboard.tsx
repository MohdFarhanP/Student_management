import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { getTeacherClasses, getTodaySchedule, getLiveSessions } from '../../api/admin/teacherApi';
import { fetchSessionAttendance, SessionAttendanceDTO } from '../../api/teacher/teacherApi';
import { getWeeklyAttendance } from '../../api/admin/classApi'; //
import { Unauthorized } from '../Unauthorized';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

const TeacherSidebar = lazy(() => import('../../components/TeacherSidebar'));
const NotificationBell = lazy(() => import('../../components/NotificationBell'));
const MyClassesSubjects = lazy(() => import('../../components/MyClassesSubjects'));
const TodaySchedule = lazy(() => import('../../components/TodaySchedule'));
const MyLiveSessions = lazy(() => import('../../components/MyLiveSessions'));
const AttendanceOverviewChart = lazy(() => import('../../components/AttendanceOverviewChart'));

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

interface AttendanceData {
  day: string;
  attendance: number;
}

const TeacherDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
  const [classes, setClasses] = useState<ClassSubject[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionAttendance, setSessionAttendance] = useState<SessionAttendanceDTO[]>([]);
  const [weeklyData, setWeeklyData] = useState<AttendanceData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [classesData, scheduleData, sessionsData, attendanceData] = await Promise.all([
        getTeacherClasses(),
        getTodaySchedule(),
        getLiveSessions(),
        fetchSessionAttendance(),
      ]);

      setClasses(classesData!);
      setSchedule(scheduleData!);
      setSessions(sessionsData!);
      setSessionAttendance(attendanceData!);
      // Set the first class as default if available
      if (classesData && classesData.length > 0) {
        setSelectedClassId(classesData[0].classId);
      }
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
    const fetchAttendance = async () => {
      if (!selectedClassId) return;
      setIsLoading(true);
      setAttendanceError(null);
      try {
        console.log('Fetching weekly attendance for classId:', selectedClassId);
        const attendanceData = await getWeeklyAttendance(selectedClassId);
        setWeeklyData(attendanceData!);
      } catch (err) {
        console.error('Attendance fetch error:', err);
        setAttendanceError('Failed to load attendance data');
        toast.error('Failed to load attendance data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedClassId]);

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'Teacher') {
    return <Unauthorized />;
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <TeacherSidebar />
        </Suspense>
      </ErrorBoundary>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content dark:text-white sm:text-3xl">
            Teacher Dashboard
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <MyClassesSubjects data={classes} />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <TodaySchedule data={schedule} />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="w-full">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <MyLiveSessions sessions={sessions} />
                </Suspense>
              </ErrorBoundary>
            </div>
            {/* Recent Session Attendance Section */}
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                Recent Video Class Attendance (Duration lessthan 1 Hour)
              </h2>
              {sessionAttendance.length === 0 ? (
                <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    No recent sessions with students attending less than 1 hour.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sessionAttendance.map((session) => (
                    <div
                      key={session.sessionId}
                      className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6"
                    >
                      <h3 className="text-md font-semibold text-base-content dark:text-white mb-4">
                        {session.title} (Session ID: {session.sessionId})
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Scheduled At:{' '}
                        {session.scheduledAt
                          ? new Date(session.scheduledAt).toLocaleString()
                          : 'Not scheduled'}
                      </p>
                      <h4 className="text-md font-semibold text-base-content dark:text-white mb-2">
                        Students Attended Less Than 1 Hour
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th className="text-base-content dark:text-white">Student Name</th>
                              <th className="text-base-content dark:text-white">Duration (Minutes)</th>
                              <th className="text-base-content dark:text-white">Join Time</th>
                              <th className="text-base-content dark:text-white">Leave Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {session.students.map((student) => (
                              <tr key={student.studentId}>
                                <td className="text-gray-600 dark:text-gray-300">
                                  {student.studentName}
                                </td>
                                <td className="text-gray-600 dark:text-gray-300">
                                  {(student.durationSeconds / 60).toFixed(2)}
                                </td>
                                <td className="text-gray-600 dark:text-gray-300">
                                  {new Date(student.joinTime).toLocaleString()}
                                </td>
                                <td className="text-gray-600 dark:text-gray-300">
                                  {new Date(student.leaveTime).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Weekly Attendance Chart Section */}
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
                Weekly Attendance Overview
              </h2>
              {classes.length > 0 && (
                <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6 mb-6">
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
                        <option key={cls.classId} value={cls.classId}>
                          {cls.className} - {cls.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {attendanceError && (
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
                      <span>{attendanceError}</span>
                    </div>
                  </div>
                </div>
              )}
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  {isLoading || !selectedClassId ? (
                    <LoadingSpinner />
                  ) : (
                    <AttendanceOverviewChart data={weeklyData} />
                  )}
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;