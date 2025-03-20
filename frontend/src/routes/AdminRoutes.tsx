import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import Class from '../pages/admin/Class';
import Subject from '../pages/admin/Subject';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/class" element={<Class />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/subject" element={<Subject />} />
    </Routes>
  );
};

export default AdminRoutes;
