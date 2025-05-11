import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import StudentAttendanceView from '../pages/student/StudentAttendanceView';
import StudentChat from '../pages/student/StudentChat';
import NoteList from '../pages/student/NoteList';
import LiveSession from '../components/LiveSession';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LeaveManagement from '../components/LeaveManagement';

const StudentRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendanceView />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/notes" element={<NoteList />} />
        <Route
          path="/live-session"
          element={<LiveSession userRole="Student" userId={user?.id || ''} />}
        />
        <Route path="/leave/apply" element={<LeaveManagement mode="apply" />} />
        <Route path="/leave/history" element={<LeaveManagement mode="history" />} />
      </Routes>
    </div>
  );
};

export default StudentRoutes;
