import React from 'react';
import { TimetableSlot } from '../types/timetable';

const TodaysTimetable: React.FC<{ periods: TimetableSlot[] }> = ({ periods }) => {
  // Split periods into left (first 3) and right (next 3)
  const leftPeriods = periods.slice(0, 3);
  const rightPeriods = periods.slice(3, 6);

  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
          Today's Timetable
        </h2>
        {periods.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No classes scheduled for today.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column */}
            <ul className="space-y-3">
              {leftPeriods.map((slot) => (
                <li
                  key={slot._id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-base-content dark:text-white">
                      Period {slot.period}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {slot.subject || 'Not Scheduled'}
                    </p>
                  </div>
                  <p className="text-sm text-primary dark:text-primary-content">
                    {slot.teacherName || 'Not Scheduled'}
                  </p>
                </li>
              ))}
            </ul>
            {/* Right Column */}
            <ul className="space-y-3">
              {rightPeriods.map((slot) => (
                <li
                  key={slot._id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-base-content dark:text-white">
                      Period {slot.period}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {slot.subject || 'Not Scheduled'}
                    </p>
                  </div>
                  <p className="text-sm text-primary dark:text-primary-content">
                    {slot.teacherName || 'Not Scheduled'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysTimetable;