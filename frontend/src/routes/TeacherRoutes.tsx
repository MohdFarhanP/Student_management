import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceDashboard from '../pages/teacher/TeacherAttendanceDashboard';
import TeacherChat from '../pages/teacher/TeacherChat';
import NoteUpload from '../pages/teacher/NoteUpload';

const TeacherRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/attendance" element={<TeacherAttendanceDashboard />} />
        <Route path="/chat" element={<TeacherChat />} />
        <Route path="/notes" element={<NoteUpload />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
