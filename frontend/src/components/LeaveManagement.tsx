import { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { Leave, LeaveStatus, ApplyForm  } from '../types/leave';
import ErrorBoundary from '../components/ErrorBoundary';

interface LeaveManagementProps {
  mode: 'apply' | 'history' | 'teacher';
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ mode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState<ApplyForm>({ date: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSocket(user, mode, setLeaves, setForm, setIsSubmitting, setError);

  useEffect(() => {
    if (!user) return;

    if (mode === 'history' || mode === 'teacher') {
      socket.emit(
        'view-leave-history',
        {
          userId: user.id,
          studentId: mode === 'history' ? user.id : '',
        },
        ({ success, leaves, error }: { success: boolean; leaves?: Leave[]; error?: string }) => {
          if (success && leaves) {
            setLeaves(leaves);
          } else {
            toast.error(error || 'Failed to load leave history');
            setError(error || 'Failed to load leave history');
          }
        }
      );
    }
  }, [mode, user]);

  const handleApplyLeave = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!socket.connected || !user) {
      toast.error('Not connected or not authenticated');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    socket.emit(
      'apply-for-leave',
      {
        studentId: user.id,
        date: form.date,
        reason: form.reason,
      },
      ({ success, error }: { success: boolean; error?: string }) => {
        if (!success) {
          toast.error(error || 'Failed to apply for leave');
          setError(error || 'Failed to apply for leave');
          setIsSubmitting(false);
        }
      }
    );
  }, [form, user]);

  const handleApproveReject = useCallback((leaveId: string, status: 'Approved' | 'Rejected') => {
    if (!socket.connected || !user) {
      toast.error('Not connected or not authenticated');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    socket.emit(
      'approve-reject-leave',
      {
        leaveId,
        teacherId: user.id,
        status,
      },
      ({ success, error }: { success: boolean; error?: string }) => {
        if (!success) {
          toast.error(error || `Failed to ${status.toLowerCase()} leave`);
          setError(error || `Failed to ${status.toLowerCase()} leave`);
          setIsSubmitting(false);
        }
      }
    );
  }, [user]);

  if (!user) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Please log in to manage leaves</div>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {mode === 'apply' && (
          <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
              Apply for Leave
            </h2>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content dark:text-gray-300">Date</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-white"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content dark:text-gray-300">Reason</span>
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="textarea textarea-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-white h-32"
                  placeholder="Enter your reason for leave"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary w-full sm:w-auto ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        {(mode === 'history' || mode === 'teacher') && (
          <div className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-xl p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white mb-4">
              {mode === 'history' ? 'Leave History' : 'Pending Leave Requests'}
            </h2>
            {leaves.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No leaves found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      {mode === 'teacher' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {leaves
                      .filter((leave): leave is Leave => !!leave)
                      .map((leave) => (
                        <tr key={leave.id}>
                          <td>
                            {new Date(leave.date).toLocaleDateString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                            })}
                          </td>
                          <td>{leave.reason}</td>
                          <td>
                            <span
                              className={`badge ${
                                leave.status === LeaveStatus.Approved
                                  ? 'badge-success'
                                  : leave.status === LeaveStatus.Rejected
                                    ? 'badge-error'
                                    : 'badge-warning'
                              }`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          {mode === 'teacher' && leave.status === LeaveStatus.Pending && (
                            <td>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveReject(leave.id, 'Approved')}
                                  disabled={isSubmitting}
                                  className="btn btn-success btn-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleApproveReject(leave.id, 'Rejected')}
                                  disabled={isSubmitting}
                                  className="btn btn-error btn-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default LeaveManagement;