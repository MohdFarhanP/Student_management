import { useEffect } from 'react';
import { socket } from '../socket';
import { toast } from 'react-toastify';
import { Leave, ApplyForm  } from '../types/leave';

const useSocket = (
  user: { id: string } | null,
  mode: 'apply' | 'history' | 'teacher',
  setLeaves: React.Dispatch<React.SetStateAction<Leave[]>>,
  setForm: React.Dispatch<React.SetStateAction<ApplyForm>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('leave-applied', ({ leave }: { leave: Leave }) => {
      console.log('Received leave-applied event:', { leave });
      if (!leave || !leave.id) {
        console.error('Invalid leave-applied event payload:', leave);
        toast.error('Failed to process leave application. Please try again.');
        setIsSubmitting(false);
        return;
      }
      toast.success('Leave applied successfully!');
      setLeaves((prev) => [...prev, leave]);
      setForm({ date: '', reason: '' });
      setIsSubmitting(false);
    });

    socket.on('leave-updated', ({ leave }: { leave: Leave }) => {
      console.log('Received leave-updated event:', { leave });
      if (!leave || !leave.id || !leave.status) {
        console.error('Invalid leave-updated event payload:', leave);
        toast.error('Failed to process leave update. Please refresh the page.');
        setIsSubmitting(false);
        return;
      }
      setLeaves((prev) =>
        prev.map((l) => (l.id === leave.id ? leave : l))
      );
      toast.success(`Leave ${leave.status.toLowerCase()}!`);
      setIsSubmitting(false);
    });

    socket.on('new-leave-request', ({ leave }: { leave: Leave }) => {
      console.log('Received new-leave-request event:', { leave });
      if (!leave || !leave.id) {
        console.error('Invalid new-leave-request event payload:', leave);
        toast.error('Failed to process new leave request. Please refresh the page.');
        return;
      }
      if (mode === 'teacher') {
        setLeaves((prev) => [...prev, leave]);
        toast.info('New leave request received');
      }
    });

    socket.on('error', ({ message }: { message: string }) => {
      toast.error(message);
      setError(message);
      setIsSubmitting(false);
    });

    return () => {
      socket.off('leave-applied');
      socket.off('leave-updated');
      socket.off('new-leave-request');
      socket.off('error');
    };
  }, [user, mode, setLeaves, setForm, setIsSubmitting, setError]);
};

export default useSocket;