import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import SendNotification from '../../components/SendNotification';
import NotificationBell from '../../components/NotificationBell';
import AdminSideBar from '../../components/AdminSideBar';
import { socket } from '../../socket';

const AdminDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    socket.io.opts.query = { userId: user.id };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (!user || user.role !== 'Admin') return <div>Unauthorized</div>;

  return (
    <div className="flex bg-white">
      <AdminSideBar />

      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <NotificationBell />
        </div>

        <SendNotification />
      </div>
    </div>
  );
};

export default AdminDashboard;
