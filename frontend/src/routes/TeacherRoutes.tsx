import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherAttendanceManagement from '../pages/teacher/TeacherAttendanceManagement';

const TeacherRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/Attendance" element={<TeacherAttendanceManagement />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
