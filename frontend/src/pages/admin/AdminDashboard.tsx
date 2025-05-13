import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import SendNotification from '../../components/SendNotification';
import NotificationBell from '../../components/NotificationBell';
import AdminSideBar from '../../components/AdminSideBar';
import { socket } from '../../socket';
import DashboardStatsCard from '../../components/DashboardStatsCard';
import { FaChalkboardTeacher, FaSchool, FaUserGraduate } from 'react-icons/fa';
import TopClassesCard from '../../components/TopClassesCard';
import AttendanceOverviewChart from '../../components/AttendanceOverviewChart';
import { getAdminDashboardStats } from '../../api/admin/dashboardApi';
import { fetchClasses, getTopClasses, getWeeklyAttendance } from '../../api/admin/classApi';

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
  const isAuthLoading = useSelector((state: RootState) => state.auth.loading); // Add if applicable

  // State
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

    // Initialize socket
    socket.io.opts.query = { userId: user.id };
    socket.connect();

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
    });

    // Fetch data
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
    return <div className="p-6 text-gray-600">Loading user...</div>;
  }

  if (!user || user.role !== 'Admin') {
    return <div className="p-6 text-red-600">Unauthorized</div>;
  }

  return (
    <div className="flex bg-white min-h-screen">
      <AdminSideBar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <NotificationBell />
        </div>
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardStatsCard
            title="Students"
            count={stats.totalStudents}
            icon={<FaUserGraduate />}
            bgColor="bg-blue-100"
          />
          <DashboardStatsCard
            title="Teachers"
            count={stats.totalTeachers}
            icon={<FaChalkboardTeacher />}
            bgColor="bg-green-100"
          />
          <DashboardStatsCard
            title="Classes"
            count={stats.totalClasses}
            icon={<FaSchool />}
            bgColor="bg-yellow-100"
          />
        </div>
        <div className="p-6">
          {classes.length > 0 && (
            <div className="mb-4 flex items-center">
              <label className="mr-2 text-gray-700 font-medium">Select Class:</label>
              <select
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {isLoading ? (
            <div className="p-4 text-gray-600">Loading...</div>
          ) : (
            <AttendanceOverviewChart data={weeklyData} />
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6">
            {isLoading ? <div className="p-4 text-gray-600">Loading...</div> : <TopClassesCard data={topClasses} />}
          </div>
          <div className="p-6">
            <SendNotification />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;