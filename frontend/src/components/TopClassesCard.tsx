import React from 'react';

interface ClassAttendance {
  className: string;
  attendancePercentage: number;
}

interface TopClassesCardProps {
  data: ClassAttendance[];
}

const TopClassesCard: React.FC<TopClassesCardProps> = ({ data }) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
      <h2 className="text-xl font-semibold text-base-content dark:text-white mb-4">
        Top Performing Classes
      </h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No data available</p>
      ) : (
        <ul className="space-y-4">
          {data.map((cls, index) => (
            <li key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cls.className}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cls.attendancePercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${cls.attendancePercentage}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopClassesCard;