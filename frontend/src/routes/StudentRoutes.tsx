import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import StudentAttendanceView from '../pages/student/StudentAttendanceView';
import StudentChat from '../pages/student/StudentChat';
import NoteList from '../pages/student/NoteList';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import NotFound from '../components/NotFound';
import StudentLiveSession from '../pages/student/StudentLiveSession';
import StudentLeavePage from '../pages/student/StudentLeavePage';

const StudentRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendanceView />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/notes" element={<NoteList />} />
        <Route
          path="/live-session"
          element={<StudentLiveSession userRole="Student" userId={user?.id || ''} />}
        />
        <Route path="/leave/student" element={<StudentLeavePage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  );
};

export default StudentRoutes;
