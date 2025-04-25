import React from 'react';

interface ClassTableProps {
  classes: string[];
}

const ClassTable: React.FC<ClassTableProps> = ({ classes }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-black">Classes</h2>
      {classes.length > 0 ? (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Class Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.map((className, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-black">{className}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No classes assigned.</p>
      )}
    </div>
  );
};

export default ClassTable;
