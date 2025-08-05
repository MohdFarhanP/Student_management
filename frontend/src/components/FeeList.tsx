import { RecurringFee } from "../api/admin/studentApi";

interface FeeListProps{
  recurringFees:RecurringFee[];
  loading:boolean;
}
const FeeList = ({recurringFees,loading}:FeeListProps) => {

  return (
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
  )
}

export default FeeList
