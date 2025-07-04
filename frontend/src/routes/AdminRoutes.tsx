import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Class from '../pages/admin/Class';
import Subject from '../pages/admin/Subject';
import Student from '../pages/admin/Student';
import Teacher from '../pages/admin/Teacher';
import TimetableManagement from '../pages/admin/TimetableManagement';
import NotFound from '../components/NotFound';
import Payment from '../pages/admin/Payment';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/class" element={<Class />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/students" element={<Student />} />
      <Route path="/teachers" element={<Teacher />} />
      <Route path="/subject" element={<Subject />} />
      <Route path="/timetable" element={<TimetableManagement />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AdminRoutes;
