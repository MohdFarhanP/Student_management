import React from "react";

interface Period {
  period: number;
  subject: string;
  teacher: string;
}
const TodaysTimetable: React.FC<{ periods: Period[] }> = ({ periods }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">Today’s Timetable</h2>
    <ul className="space-y-3">
      {periods.map((p) => (
        <li
          key={p.period}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-700">Period {p.period}</p>
            <p className="text-sm text-gray-600">{p.subject}</p>
          </div>
          <p className="text-sm text-indigo-600">{p.teacher}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default TodaysTimetable;