import React from "react";

interface PeriodSchedule {
  period: number;
  subject: string | null;
  className: string;
}

interface TodayScheduleProps {
  data: PeriodSchedule[];
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today’s Schedule</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No classes scheduled for today.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item, idx) => (
            <li
              key={idx}
              className="border border-gray-200 rounded-lg px-4 py-2 flex justify-between items-center bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">Period {item.period}</p>
                <p className="text-sm text-gray-500">{item.className}</p>
              </div>
              <span className="text-sm text-indigo-600 font-semibold">{item.subject || "Free"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaySchedule;
