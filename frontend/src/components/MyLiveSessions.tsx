import React from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

interface LiveSession {
  title: string;
  className: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}

interface MyLiveSessionsProps {
  sessions: LiveSession[];
}

const MyLiveSessions: React.FC<MyLiveSessionsProps> = ({ sessions }) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
            My Live Sessions
          </h2>
        </div>
        {sessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No sessions scheduled.
          </p>
        ) : (
          <ul className="space-y-4">
            {sessions.map((session, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  session.isOngoing
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <VideoCameraIcon className="h-6 w-6 text-primary dark:text-primary-content" />
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-md font-semibold text-base-content dark:text-white">
                      {session.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {session.className}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.time}
                    </p>
                  </div>
                  {session.isOngoing ? (
                    <a
                      href={session.joinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary text-white px-4 py-1.5 rounded-md hover:bg-primary-focus"
                    >
                      Join Now
                    </a>
                  ) : (
                    <span className="badge badge-ghost text-xs">Upcoming</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyLiveSessions;