import React from 'react';

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
  bgColor = 'bg-base-200',
}) => {
  return (
    <div
      className={`card ${bgColor} dark:bg-opacity-30 shadow-xl p-6 flex items-center justify-between transition-shadow hover:shadow-2xl`}
    >
      <div>
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h2>
        <p className="text-2xl font-bold text-base-content dark:text-white">{count}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
};

export default DashboardStatsCard;