import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTeacherProfile } from '../../redux/slices/teacherSlice';
import { markAttendance } from '../../api/teacher/attendenceApi';
import { getStudentsByClass } from '../../api/admin/classApi';
import { fetchTimetable } from '../../api/admin/timeTableApi';
import TeacherSidebar from '../../components/TeacherSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { TimetableData, TimetableSlot } from '../../types/timetable';

interface Student {
  id: string;
  name: string;
}

type AttendanceForm = {
  studentId: string;
  date: string;
  period: number;
  status: 'present' | 'absent';
};

type FetchError = string | null;

const TeacherAttendanceManagement: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile: teacher, loading: teacherLoading, error: teacherError } = useSelector((state: RootState) => state.teacher);
  const dispatch = useDispatch<AppDispatch>();
  const [students, setStudents] = useState<Student[]>([]);
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        if (user?.email && !teacher) {
          await dispatch(fetchTeacherProfile(user.email)).unwrap();
        }
        const [studentsData, timetableData] = await Promise.all([
          getStudentsByClass(classId!), // Updated to use getStudentsByClass
          fetchTimetable(classId!),
        ]);
        setStudents(studentsData);
        setTimetable(timetableData);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : 'Failed to fetch data') as FetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, user?.email, dispatch, teacher]);

  const handleSubmit = async (data: AttendanceForm): Promise<void> => {
    setLoading(true);
    try {
      if (!teacher?.id) throw new Error('Teacher not authenticated or ID not found');
      await markAttendance(classId!, data.studentId, data.date, data.period, data.status);
      setError(null);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Failed to mark attendance') as FetchError);
    } finally {
      setLoading(false);
    }
  };

  const assignedPeriods = timetable?.schedule[selectedDay]?.filter((slot: TimetableSlot) => slot.teacherId === teacher?.id).map((slot: TimetableSlot) => slot.period) || [];

  if (teacherLoading || loading) return <LoadingSpinner />;
  if (teacherError || error) return <ErrorMessage message={teacherError || error || 'An error occurred'} />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex flex-1 items-start justify-center bg-[#E6F0FA] p-6">
        <div className="max-w-5xl space-y-6">
          <div className="flex gap-6">
            <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between pb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Mark Attendance
                </h2>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData: AttendanceForm = {
                  studentId: (e.currentTarget.elements.namedItem('studentId') as HTMLSelectElement).value,
                  date: selectedDate,
                  period: selectedPeriod!,
                  status: (e.currentTarget.elements.namedItem('status') as HTMLSelectElement).value as 'present' | 'absent',
                };
                handleSubmit(formData);
              }} className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                    Day
                  </label>
                  <select
                    id="day"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
                    required
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    Period
                  </label>
                  <select
                    id="period"
                    value={selectedPeriod || ''}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
                    required
                  >
                    <option value="">Select a period</option>
                    {assignedPeriods.map((period: number) => (
                      <option key={period} value={period}>
                        {period}th
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    Student
                  </label>
                  <select
                    id="studentId"
                    name="studentId"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
                    required
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-black"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!selectedPeriod}
                  className="rounded-md bg-black/95 px-4 py-2 text-white transition-colors hover:bg-black disabled:bg-gray-500"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceManagement;