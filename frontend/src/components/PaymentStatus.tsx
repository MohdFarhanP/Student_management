
import PaginationButton from "./PaginationButton";
import LoadingSpinner from "./LoadingSpinner";
import { StudentFeeDue } from "../api/student/studentApi";

interface PaymentStatusProps {
  paymentStatuses:StudentFeeDue[];
  totalCount:number;
  limit:number;
  loading:boolean;
  page:number;
  setPage:React.Dispatch<React.SetStateAction<number>>;
} 
const PaymentStatus = ({paymentStatuses,totalCount,limit,loading,page,setPage}:PaymentStatusProps) => {

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
      <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
        Payment Status Overview
      </h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300"><LoadingSpinner/></p>
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
                <th>Amount</th>
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
      <PaginationButton page={page} setPage={setPage} totalPages={totalPages}/>
    </div>
  )
}

export default PaymentStatus
