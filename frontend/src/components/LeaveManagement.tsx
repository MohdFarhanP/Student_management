import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

interface Leave {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

interface LeaveManagementProps {
  mode: 'apply' | 'history' | 'teacher';
}

interface ApplyForm {
  date: string;
  reason: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ mode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState<ApplyForm>({ date: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Handle leave-applied event (student)
    socket.on('leave-applied', ({ leave }: { leave: Leave }) => {
      toast.success('Leave applied successfully!');
      setLeaves((prev) => [...prev, leave]);
      setForm({ date: '', reason: '' });
      setIsSubmitting(false);
    });

    // Handle leave-updated event (student/teacher)
    socket.on('leave-updated', ({ leave }: { leave: Leave }) => {
      setLeaves((prev) =>
        prev.map((l) => (l.id === leave.id ? leave : l))
      );
      toast.success(`Leave ${leave.status.toLowerCase()}!`);
      setIsSubmitting(false);
    });

    // Handle new-leave-request (teacher)
    socket.on('new-leave-request', ({ leave }: { leave: Leave }) => {
      if (mode === 'teacher') {
        setLeaves((prev) => [...prev, leave]);
        toast.info('New leave request received');
      }
    });

    // Handle errors
    socket.on('error', ({ message }: { message: string }) => {
      toast.error(message);
      setError(message);
      setIsSubmitting(false);
    });

    // Load leave history or pending leaves
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

    return () => {
      socket.off('leave-applied');
      socket.off('leave-updated');
      socket.off('new-leave-request');
      socket.off('error');
    };
  }, [mode, user]);

  const handleApplyLeave = (e: React.FormEvent) => {
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
  };

  const handleApproveReject = (leaveId: string, status: 'Approved' | 'Rejected') => {
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
  };

  if (!user) {
    return <div>Please log in to manage leaves</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Apply Leave Form (Student) */}
      {mode === 'apply' && (
        <form onSubmit={handleApplyLeave} style={{ marginBottom: '20px' }}>
          <h2>Apply for Leave</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>Date:</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              disabled={isSubmitting}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Reason:</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
              disabled={isSubmitting}
              style={{ marginLeft: '10px', padding: '5px', width: '100%', minHeight: '100px' }}
            />
          </div>
          <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Leave History (Student) or Pending Leaves (Teacher) */}
      {(mode === 'history' || mode === 'teacher') && (
        <div>
          <h2>{mode === 'history' ? 'Leave History' : 'Pending Leave Requests'}</h2>
          {leaves.length === 0 ? (
            <p>No leaves found</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reason</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                  {mode === 'teacher' && (
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(leave.date).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.reason}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.status}</td>
                    {mode === 'teacher' && leave.status === 'Pending' && (
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button
                          onClick={() => handleApproveReject(leave.id, 'Approved')}
                          disabled={isSubmitting}
                          style={{ marginRight: '10px', padding: '5px 10px' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveReject(leave.id, 'Rejected')}
                          disabled={isSubmitting}
                          style={{ padding: '5px 10px' }}
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;