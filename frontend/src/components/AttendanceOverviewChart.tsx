import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface AttendanceData {
  day: string;
  attendance: number;
}

interface AttendanceOverviewChartProps {
  data: AttendanceData[];
}

const AttendanceOverviewChart: React.FC<AttendanceOverviewChartProps> = ({ data }) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-base-content dark:text-white mb-4">
        Attendance Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis domain={[0, 100]} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#1f2937',
            }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceOverviewChart;