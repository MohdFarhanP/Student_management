import AdminSideBar from '../../components/AdminSideBar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex bg-white">
      <AdminSideBar />
      <h1 className="text-2xl font-bold text-black"> Welcome to Dashboard</h1>
    </div>
  );
};

export default Dashboard;
