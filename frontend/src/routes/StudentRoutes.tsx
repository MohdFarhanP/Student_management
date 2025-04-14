import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import StudentAttendanceView from '../pages/student/StudentAttendanceView';
import StudentChat from '../pages/student/StudentChat';

const StudentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendanceView />} />
        <Route path="/chat" element={<StudentChat />} />
      </Routes>
    </div>
  );
};

export default StudentRoutes;
