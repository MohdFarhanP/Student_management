import React from 'react';
import { ILiveSessions } from '../api/admin/studentApi';

const LiveSessions: React.FC<{ sessions: ILiveSessions[] }> = ({ sessions }) => (
  <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-xl font-semibold text-base-content dark:text-white">
        Live Sessions
      </h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No live sessions for today.
        </p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s, idx) => (
            <li
              key={idx}
              className={`p-4 rounded-lg border ${
                s.isOngoing
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
            >
              <div>
                <p className="text-sm font-semibold text-base-content dark:text-white">
                  {s.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.time}
                </p>
              </div>
              {s.isOngoing ? (
                <a
                  href={s.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary text-white px-4 py-1.5 rounded-md hover:bg-primary-focus"
                >
                  Join Now
                </a>
              ) : (
                <span className="badge badge-ghost text-xs">
                  Upcoming
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default LiveSessions;