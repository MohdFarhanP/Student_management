import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceDashboard from '../pages/teacher/TeacherAttendanceDashboard';
import TeacherChat from '../pages/teacher/TeacherChat';

const TeacherRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/attendance" element={<TeacherAttendanceDashboard />} />
        <Route path="/chat" element={<TeacherChat />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
