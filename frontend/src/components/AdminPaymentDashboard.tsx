import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  createRecurringFee,
  getAllRecurringFees,
  getPaymentStatuses,
  RecurringFee,
} from '../api/admin/studentApi';
import { fetchClasses } from '../api/admin/classApi';
import ClassSelector from './ClassSelector';
import PaymentStatus from './PaymentStatus';
import FeeList from './FeeList';
import { StudentFeeDue } from '../api/student/studentApi';

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
  const [classes, setClasses] = useState<Class[]>([]);
  const [feeUpdateCount, setFeeUpdateCount] = useState(0);
  const [recurringFees, setRecurringFees] = useState<RecurringFee[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<StudentFeeDue[]>([]);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);
  const [loadingRecurringFees, setLoadingRecurringFees] = useState(false);
  const [creatingFee, setCreatingFee] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await fetchClasses();
        const mappedClasses: Class[] =
          classData?.map((cls) => ({
            _id: cls._id,
            name: cls.name,
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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingPaymentStatus(true);
        const res = await getPaymentStatuses(page, limit);
        if (res) {
          setPaymentStatuses(res.duesDto);
          setTotalCount(res.totalCount);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.error('Error:', error.message);
        } else {
          toast.error('An unexpected error occurred.');
          console.error('Unknown error:', error);
        }
      } finally {
        setLoadingPaymentStatus(false);
      }
    };
    fetch();
  }, [page]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingRecurringFees(true);
        const fees = await getAllRecurringFees();
        if (fees) setRecurringFees(fees);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.error('Error:', error.message);
        } else {
          toast.error('An unexpected error occurred.');
          console.error('Unknown error:', error);
        }
      } finally {
        setLoadingRecurringFees(false);
      }
    };
    fetch();
  }, [feeUpdateCount]);

  // Handle form submission for creating a recurring fee
  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingFee(true);
      if (
        !feeForm.title ||
        !feeForm.amount ||
        isNaN(parseFloat(feeForm.amount)) ||
        !feeForm.classId
      ) {
        toast.error('Please fill all fields with valid data.');
        return;
      }
      await createRecurringFee({
        title: feeForm.title,
        amount: parseFloat(feeForm.amount),
        startMonth: feeForm.startMonth,
        endMonth: feeForm.endMonth || undefined,
        classId: feeForm.classId,
        className: 'unknown',
        recurring: true,
      });
      setFeeUpdateCount((prev) => prev + 1);
      setFeeForm({
        title: '',
        amount: '',
        startMonth: '',
        endMonth: '',
        classId: '',
      });
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
      setCreatingFee(false);
    }
  };

  // Handle class selection from ClassSelector
  const handleSelectClass = (classId: string) => {
    setFeeForm({ ...feeForm, classId });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Create Recurring Fee Form */}
      <div className="card bg-base-100 mb-6 p-6 shadow-xl dark:bg-gray-800">
        <h2 className="text-base-content mb-4 text-lg font-semibold dark:text-white">
          Create Recurring Fee
        </h2>
        <form onSubmit={handleCreateFee} className="space-y-4">
          <input
            type="text"
            placeholder="Fee Title (e.g., Monthly Tuition Fee)"
            value={feeForm.title}
            onChange={(e) => setFeeForm({ ...feeForm, title: e.target.value })}
            className="input input-bordered w-full"
            disabled={creatingFee}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={feeForm.amount}
            onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
            className="input input-bordered w-full"
            disabled={creatingFee}
          />
          <input
            type="month"
            value={feeForm.startMonth}
            onChange={(e) =>
              setFeeForm({ ...feeForm, startMonth: e.target.value })
            }
            className="input input-bordered w-full"
            disabled={creatingFee}
          />
          <input
            type="month"
            value={feeForm.endMonth}
            onChange={(e) =>
              setFeeForm({ ...feeForm, endMonth: e.target.value })
            }
            className="input input-bordered w-full"
            disabled={creatingFee}
          />
          <ClassSelector
            classes={classes}
            selectedClassId={feeForm.classId}
            onSelectClass={handleSelectClass}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={creatingFee}
          >
            {creatingFee ? 'Creating...' : 'Create Fee'}
          </button>
        </form>
      </div>

      {/* List of Recurring Fees */}
      <FeeList recurringFees={recurringFees} loading={loadingRecurringFees} />

      {/* Payment Status Overview */}
      <PaymentStatus
        paymentStatuses={paymentStatuses}
        totalCount={totalCount}
        limit={limit}
        loading={loadingPaymentStatus}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default AdminPaymentDashboard;

