import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStdInfo, getUnpaidDues, processPayment, StudentFeeDue, studentInfo } from '../api/student/studentApi';


// Define the Razorpay type to avoid using `any`
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

const StudentPaymentDashboard: React.FC = () => {
  const [dues, setDues] = useState<StudentFeeDue[]>([]);
  const [studentInfo, setStudentInfo] = useState<studentInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Fetch unpaid dues on mount
  useEffect(() => {
    const fetchDues = async () => {
      try {
        setLoading(true);
        const [unpaidDues, studentinfo] = await Promise.all([
          getUnpaidDues(),
          getStdInfo(),
        ]);
        // Handle potential null values
        setDues(unpaidDues ?? []);
        setStudentInfo(studentinfo ?? undefined);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.error('Error:', error.message);
        } else {
          toast.error('An unexpected error occurred.');
          console.error('Unknown error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  // Handle payment initiation
  const handlePay = async (feeDue: StudentFeeDue) => {
    try {
      setLoading(true);
      const { order } = await processPayment(feeDue.id);

      // Razorpay checkout options
      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: feeDue.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Monthly School Payment',
        description: `Payment for ${feeDue.feeTitle} (${feeDue.month})`,
        order_id: order.id,
        handler: (response: RazorpayResponse) => {
          toast.success('Payment successful!');
          setDues(dues.filter((d) => d.id !== feeDue.id));
        },
        prefill: {
          name: studentInfo?.name ?? 'Student Name',
          email: studentInfo?.email ?? 'student@example.com',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: { error: { description: string } }) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error('Error:', error.message);
      } else {
        toast.error('An unexpected error occurred.');
        console.error('Unknown error:', error);
      }
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Unpaid Dues List */}
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
          Unpaid Dues
        </h2>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : dues.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No unpaid dues.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Fee Title</th>
                  <th>Month</th>
                  <th>Amount (₹)</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((due) => (
                  <tr key={due.id}>
                    <td>{due.feeTitle}</td>
                    <td>{due.month}</td>
                    <td>{due.amount}</td>
                    <td>{new Date(due.dueDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handlePay(due)}
                        className="btn btn-primary btn-sm"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Pay Now'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPaymentDashboard;