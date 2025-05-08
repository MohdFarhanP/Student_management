import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceDashboard from '../pages/teacher/TeacherAttendanceDashboard';
import TeacherChat from '../pages/teacher/TeacherChat';
import NoteUpload from '../pages/teacher/NoteUpload';
import LiveSession from '../components/LiveSession';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const TeacherRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/attendance" element={<TeacherAttendanceDashboard />} />
        <Route path="/chat" element={<TeacherChat />} />
        <Route path="/notes" element={<NoteUpload />} />
        <Route
          path="/live-session"
          element={<LiveSession userRole="Teacher" userId={user?.id || ''} />}
        />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
