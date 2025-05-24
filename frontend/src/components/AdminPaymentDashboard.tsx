import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createRecurringFee, generateMonthlyDues, getAllRecurringFees, getPaymentStatuses, RecurringFee, StudentFeeDue } from '../api/admin/studentApi';
import { getClassNames } from '../api/admin/classApi';
import ClassSelector from './ClassSelector';

// Define the Class type to match the expected structure
type Class = {
  _id?: string;
  name: string;
};

const AdminPaymentDashboard: React.FC = () => {
  const [feeForm, setFeeForm] = useState({
    title: '',
    amount: '',
    startMonth: '',
    endMonth: '',
    classId: '',
  });
  const [recurringFees, setRecurringFees] = useState<RecurringFee[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<StudentFeeDue[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch recurring fees, payment statuses, and classes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fees, statuses, classData] = await Promise.all([
          getAllRecurringFees(),
          getPaymentStatuses(),
          getClassNames(),
        ]);
        setRecurringFees(fees!);
        setPaymentStatuses(statuses!);
        // Map the class data to match the Class type (assuming getClassNames returns { id, grade })
        const mappedClasses: Class[] = classData?.map((cls: { id: string; grade: string }) => ({
          _id: cls.id,
          name: cls.grade,
        })) || [];
        setClasses(mappedClasses);
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
    fetchData();
  }, []);

  // Handle form submission for creating a recurring fee
  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!feeForm.title || !feeForm.amount || isNaN(parseFloat(feeForm.amount)) || !feeForm.classId) {
        toast.error('Please fill all fields with valid data.');
        return;
      }
      const newFee = await createRecurringFee({
        title: feeForm.title,
        amount: parseFloat(feeForm.amount),
        startMonth: feeForm.startMonth,
        endMonth: feeForm.endMonth || undefined,
        classId: feeForm.classId,
        recurring: true,
      });
      setRecurringFees([...recurringFees, newFee!]);
      setFeeForm({ title: '', amount: '', startMonth: '', endMonth: '', classId: '' });
      toast.success('Recurring fee created successfully!');
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

  // Handle manual dues generation
  const handleGenerateDues = async () => {
    if (!generateMonth) {
      toast.error('Please select a month');
      return;
    }
    try {
      setLoading(true);
      await generateMonthlyDues(generateMonth);
      const updatedStatuses = await getPaymentStatuses();
      setPaymentStatuses(updatedStatuses!);
      toast.success(`Dues generated for ${generateMonth}`);
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

  // Handle class selection from ClassSelector
  const handleSelectClass = (classId: string) => {
    setFeeForm({ ...feeForm, classId });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Create Recurring Fee Form */}
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
          Create Recurring Fee
        </h2>
        <form onSubmit={handleCreateFee} className="space-y-4">
          <input
            type="text"
            placeholder="Fee Title (e.g., Monthly Tuition Fee)"
            value={feeForm.title}
            onChange={(e) => setFeeForm({ ...feeForm, title: e.target.value })}
            className="input input-bordered w-full"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={feeForm.amount}
            onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
            className="input input-bordered w-full"
            disabled={loading}
          />
          <input
            type="month"
            value={feeForm.startMonth}
            onChange={(e) => setFeeForm({ ...feeForm, startMonth: e.target.value })}
            className="input input-bordered w-full"
            disabled={loading}
          />
          <input
            type="month"
            value={feeForm.endMonth}
            onChange={(e) => setFeeForm({ ...feeForm, endMonth: e.target.value })}
            className="input input-bordered w-full"
            disabled={loading}
          />
          <ClassSelector
            classes={classes}
            selectedClassId={feeForm.classId}
            onSelectClass={handleSelectClass}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Fee'}
          </button>
        </form>
      </div>

      {/* List of Recurring Fees */}
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
          Recurring Fees
        </h2>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : recurringFees.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No recurring fees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount (₹)</th>
                  <th>Start Month</th>
                  <th>End Month</th>
                  <th>Class Name</th>
                  <th>Recurring</th>
                </tr>
              </thead>
              <tbody>
                {recurringFees.map((fee) => (
                  <tr key={fee.id}>
                    <td>{fee.title}</td>
                    <td>{fee.amount}</td>
                    <td>{fee.startMonth}</td>
                    <td>{fee.endMonth || 'N/A'}</td>
                    <td>{fee.className}</td>
                    <td>{fee.recurring ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Monthly Dues Manually */}
      {/* <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
          Generate Monthly Dues (Manual)
        </h2>
        <div className="flex space-x-4 items-center">
          <input
            type="month"
            value={generateMonth}
            onChange={(e) => setGenerateMonth(e.target.value)}
            className="input input-bordered w-full max-w-xs"
            disabled={loading}
          />
          <button
            onClick={handleGenerateDues}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Dues'}
          </button>
        </div>
      </div> */}

      {/* Payment Status Overview */}
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
          Payment Status Overview
        </h2>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : paymentStatuses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Fee Title</th>
                  <th>Month</th>
                  <th>Amount (₹)</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {paymentStatuses.map((status) => (
                  <tr key={status.id}>
                    <td>{status.studentId}</td>
                    <td>{status.feeTitle}</td>
                    <td>{status.month}</td>
                    <td>{status.amount}</td>
                    <td>{new Date(status.dueDate).toLocaleDateString()}</td>
                    <td>{status.isPaid ? 'Paid' : 'Unpaid'}</td>
                    <td>{status.paymentId || 'N/A'}</td>
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

export default AdminPaymentDashboard;