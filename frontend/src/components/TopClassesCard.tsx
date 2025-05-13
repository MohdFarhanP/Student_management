import React from "react";

interface ClassAttendance {
  className: string;
  attendancePercentage: number;
}

interface TopClassesCardProps {
  data: ClassAttendance[];
}

const TopClassesCard: React.FC<TopClassesCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Performing Classes</h2>
      <ul className="space-y-4">
        {data.map((cls, index) => (
          <li key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-gray-700 font-medium">{cls.className}</span>
              <span className="text-sm text-gray-500">{cls.attendancePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${cls.attendancePercentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopClassesCard;
