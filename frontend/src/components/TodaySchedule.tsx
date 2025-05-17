import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import ErrorBoundary from './ErrorBoundary';

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
    <ErrorBoundary>
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
            Today’s Schedule
          </h2>
          {data.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No classes scheduled for today.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <ClockIcon className="h-6 w-6 text-primary dark:text-primary-content" />
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-base-content dark:text-white">
                        Period {item.period}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.className}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary dark:text-primary-content">
                      {item.subject || 'Free'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TodaySchedule;