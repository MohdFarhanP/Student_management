import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTeacherProfile } from '../../redux/slices/teacherSlice';
import { markAttendanceStd } from '../../api/teacher/attendenceApi';
import { getStudentsByClass } from '../../api/admin/classApi';
import { fetchClasses } from '../../api/admin/classApi';
import TeacherSidebar from '../../components/TeacherSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TimetableData, TimetableSlot } from '../../types/timetable';
import { fetchTimetable } from '../../api/admin/timeTableApi';
import profile from '../../assets/profile.jpg';
import { toast } from 'react-toastify';
import { UserGroupIcon, CalendarIcon, ClockIcon, AcademicCapIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Class {
  _id: string;
  name: string;
  chatRoomId?: string;
  section?: string;
  grade?: string;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  class: string;
  gender: 'Male' | 'Female';
  profileImage: string;
}

type AttendanceStatus = 'present' | 'absent';

const TeacherAttendanceDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile: teacher, loading: teacherLoading } = useSelector(
    (state: RootState) => state.teacher
  );
  const dispatch = useDispatch<AppDispatch>();

  const [classes, setClasses] = useState<Partial<Class>[] | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch initial data (classes and teacher profile)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user?.email) throw new Error('User not authenticated');
        await dispatch(fetchTeacherProfile(user.email)).unwrap();
        const classesData = await fetchClasses();
        setClasses(classesData);
        if (classesData?.length > 0) {
          setSelectedClassId(classesData[0]._id ?? '');
        }
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to fetch data'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email, dispatch]);

  // Update students, timetable, and attendance when classId or day changes
  useEffect(() => {
    const fetchUpdatedData = async () => {
      if (!selectedClassId) return;
      setLoading(true);
      try {
        const [studentsData, timetableData] = await Promise.all([
          getStudentsByClass(selectedClassId),
          fetchTimetable(selectedClassId),
        ]);
        setStudents(
          studentsData?.map((student) => ({
            ...student,
            class: classes?.find((c) => c._id === student.class)?.name || '',
          })) || []
        );
        setTimetable(timetableData!);
        const initialAttendance: Record<string, AttendanceStatus> = {};
        studentsData?.forEach(
          (student) => (initialAttendance[student.id] = 'present')
        );
        setAttendance(initialAttendance);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to fetch updated data'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUpdatedData();
  }, [selectedClassId, selectedDay, classes]);

  // Validate teacher assignment
  const isTeacherAssigned = () => {
    if (!timetable || !teacher?.id) return false;
    const slots = timetable.schedule[selectedDay] || [];
    return slots.some(
      (slot: TimetableSlot) =>
        slot.teacherId === teacher.id && slot.period === selectedPeriod
    );
  };

  // Handle attendance change and save immediately
  const handleAttendanceChange = async (
    studentId: string,
    status: AttendanceStatus
  ) => {
    if (!isTeacherAssigned()) {
      toast.error('You are not assigned to this period');
      return;
    }

    // Optimistic UI update
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setLoading(true);
    try {
      if (!teacher?.id)
        throw new Error('Teacher not authenticated or ID not found');
      await markAttendanceStd(
        selectedClassId,
        studentId,
        selectedDate,
        selectedPeriod,
        status,
        selectedDay,
        teacher.id
      );
      toast.success('Attendance updated successfully');
    } catch (err: unknown) {
      // Revert UI on failure
      setAttendance((prev) => ({
        ...prev,
        [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
      }));
      toast.error(
        err instanceof Error ? err.message : 'Failed to save attendance'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (teacherLoading || loading) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold ml-15 text-base-content dark:text-white">
            Attendance
          </h2>
          <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
            <div className="card-body">
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class
                  </label>
                  <div className="flex items-center">
                    <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="classFilter"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="select select-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    >
                      <option value="">Select a class</option>
                      {classes?.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <div className="flex items-center">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="date"
                      id="dateFilter"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Day
                  </label>
                  <div className="flex items-center">
                    <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="dayFilter"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="select select-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
                        (day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Period
                  </label>
                  <div className="flex items-center">
                    <AcademicCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="periodFilter"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                      className="select select-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    >
                      {[1, 2, 3, 4, 5, 6].map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Students
                  </label>
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No students found.
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="card bg-base-100 dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={student.profileImage || profile}
                            alt={`${student.name}'s profile`}
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = profile)}
                          />
                          <div>
                            <h3 className="text-sm font-medium text-base-content dark:text-white">
                              {student.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {student.email}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {student.gender}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-primary dark:text-primary-content" />
                          <select
                            value={attendance[student.id] || 'present'}
                            onChange={(e) =>
                              handleAttendanceChange(
                                student.id,
                                e.target.value as AttendanceStatus
                              )
                            }
                            className="select select-bordered bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceDashboard;