import React from 'react';

interface DataTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => JSX.Element;
}

export const DataTable: React.FC<DataTableProps> = ({ headers, data, renderRow }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};