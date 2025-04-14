import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceDashboard from '../pages/teacher/TeacherAttendanceDashboard';

const TeacherRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/attendance" element={<TeacherAttendanceDashboard />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
