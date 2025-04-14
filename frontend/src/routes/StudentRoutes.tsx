import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import StudentAttendanceView from '../pages/student/StudentAttendanceView';

const StudentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendanceView />} />
      </Routes>
    </div>
  );
};

export default StudentRoutes;
