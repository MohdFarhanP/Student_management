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

interface Class {
  _id: string;
  name: string;
  chatRoomId?:string;
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

  const [classes, setClasses] = useState<Partial<Class>[]>();
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
        if (classesData!.length > 0) {
          setSelectedClassId(classesData![0]._id ?? '');
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
      if (!selectedClassId) return; // Prevent fetch if no class is selected
      setLoading(true);
      try {
        const [studentsData, timetableData] = await Promise.all([
          getStudentsByClass(selectedClassId),
          fetchTimetable(selectedClassId),
        ]);
        console.log(
          'this is the students data from the teacher attendance management ',
          studentsData
        );
        setStudents(
          studentsData!.map((student) => ({
            ...student,
            class: classes!.find((c) => c._id === student.class)?.name || '',
          }))
        );
        setTimetable(timetableData!);
        const initialAttendance: Record<string, AttendanceStatus> = {};
        studentsData!.forEach(
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

  // Handle attendance change for a student
  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Save all attendance records
  const handleSaveAttendance = async () => {
    if (!isTeacherAssigned()) {
      toast.error('You are not assigned to this period');
      return;
    }
    setLoading(true);
    try {
      if (!teacher?.id)
        throw new Error('Teacher not authenticated or ID not found');
      const promises = Object.entries(attendance).map(([studentId, status]) =>
        markAttendanceStd(
          selectedClassId,
          studentId,
          selectedDate,
          selectedPeriod,
          status,
          selectedDay,
          teacher?.id ?? ''
        )
      );
      await Promise.all(promises);
    } catch (err: unknown) {
      toast.error(
        (err instanceof Error
          ? err.message
          : 'Failed to save attendance') as string
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
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 bg-[#E6F0FA] p-6">
        <div className="mx-70 max-w-5xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-800">
            Attendance
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
            <div className="mb-4 flex items-center justify-between space-x-4">
              <div>
                <label
                  htmlFor="classFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Class
                </label>
                <select
                  id="classFilter"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
                >
                  <option value="">Select a class</option>
                  {classes!.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="dateFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="dateFilter"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor="dayFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Day
                </label>
                <select
                  id="dayFilter"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
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
              <div>
                <label
                  htmlFor="periodFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Period
                </label>
                <select
                  id="periodFilter"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
                >
                  {[1, 2, 3, 4, 5, 6].map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/4">
                <input
                  type="text"
                  placeholder="Search for a student by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-600">
                    <th className="border-b px-4 py-2 text-left text-gray-800 dark:text-gray-200"></th>
                    <th className="border-b px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                      Student ID
                    </th>
                    <th className="border-b px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                      Email Address
                    </th>
                    <th className="border-b px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                      Gender
                    </th>
                    <th className="border-b px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="border-b px-4 py-2">
                        <img
                          src={student.profileImage || profile}
                          alt={`${student.name}'s profile`}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => (e.currentTarget.src = profile)}
                        />
                      </td>{' '}
                      <td className="border-b px-4 py-2 text-gray-800 dark:text-gray-200">
                        {student.name}
                      </td>
                      <td className="border-b px-4 py-2 text-gray-800 dark:text-gray-200">
                        {student.email}
                      </td>
                      <td className="border-b px-4 py-2 text-gray-800 dark:text-gray-200">
                        {student.gender}
                      </td>
                      <td className="border-b px-4 py-2">
                        <select
                          value={attendance[student.id] || 'present'}
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.id,
                              e.target.value as AttendanceStatus
                            )
                          }
                          className="rounded-md border border-gray-300 bg-white p-1 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-400"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSaveAttendance}
                disabled={filteredStudents.length === 0 || !isTeacherAssigned()}
                className="rounded-md bg-black/95 px-4 py-2 text-white transition-colors hover:bg-black disabled:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceDashboard;
