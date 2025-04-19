import { Route, Routes } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import StudentAttendanceView from '../pages/student/StudentAttendanceView';
import StudentChat from '../pages/student/StudentChat';
import NoteList from '../pages/student/NoteList';

const StudentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendanceView />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/notes" element={<NoteList />} />
      </Routes>
    </div>
  );
};

export default StudentRoutes;
