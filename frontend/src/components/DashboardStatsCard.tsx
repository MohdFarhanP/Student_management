import React from "react";

interface DashboardStatsCardProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  bgColor?: string;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  count,
  icon,
  bgColor = "bg-blue-100",
}) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 flex items-center justify-between ${bgColor}`}>
      <div>
        <h2 className="text-sm text-gray-600 font-medium">{title}</h2>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
      <div className="text-gray-700 text-3xl">{icon}</div>
    </div>
  );
};

export default DashboardStatsCard;
