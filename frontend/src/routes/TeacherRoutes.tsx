import { Route, Routes } from 'react-router-dom';
import TeacherProfile from '../pages/teacher/TeacherProfile';

const TeacherRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<TeacherProfile />} />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;
