import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceDashboard from '../pages/teacher/TeacherAttendanceDashboard';
import TeacherChat from '../pages/teacher/TeacherChat';
import NoteUpload from '../components/NoteUpload';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import NotFound from '../components/NotFound';
import TeacherLiveSession from '../pages/teacher/TeacherLiveSession';
import TeacherLeavePage from '../pages/teacher/TeacherLeavePage';

const TeacherRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/attendance" element={<TeacherAttendanceDashboard />} />
        <Route path="/chat" element={<TeacherChat />} />
        <Route path="/notes" element={<NoteUpload />} />
        <Route
          path="/live-session"
          element={<TeacherLiveSession userRole="Teacher" userId={user?.id || ''} />}
        />
        <Route path="/leave/teacher" element={<TeacherLeavePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
