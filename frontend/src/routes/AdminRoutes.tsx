import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Class from '../pages/admin/Class';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="class" element={<Class />} />
        <Route path="settings" element={<h1>Settings Page</h1>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
