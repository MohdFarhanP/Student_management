import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';

const StudentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </div>
  );
};

export default StudentRoutes;
