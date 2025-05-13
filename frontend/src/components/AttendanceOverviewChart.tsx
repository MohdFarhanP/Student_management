import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface AttendanceData {
  day: string;
  attendance: number;
}

interface AttendanceOverviewChartProps {
  data: AttendanceData[];
}

const AttendanceOverviewChart: React.FC<AttendanceOverviewChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Attendance Overview</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Line type="monotone" dataKey="attendance" stroke="#4b5563" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceOverviewChart;