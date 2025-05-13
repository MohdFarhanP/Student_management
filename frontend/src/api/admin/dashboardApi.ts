import { socket } from '../../socket';
import { toast } from 'react-toastify';

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

// Fetch dashboard stats via Socket.IO
export const getAdminDashboardStats = (): Promise<Stats> => {
  return new Promise((resolve, reject) => {
    socket.emit('get-admin-dashboard-stats', null, (response: { success: boolean; stats?: Stats; error?: string }) => {
      if (response.success && response.stats) {
        resolve(response.stats);
      } else {
        const error = response.error || 'Failed to fetch dashboard stats';
        toast.error(error);
        reject(new Error(error));
      }
    });
  });
};



