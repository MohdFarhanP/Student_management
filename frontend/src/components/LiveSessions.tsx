import React from "react";

interface LiveSession {
  title: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}
const LiveSessions: React.FC<{ sessions: LiveSession[] }> = ({ sessions }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">Live Sessions</h2>
    {sessions.length === 0 ? (
      <p className="text-gray-500 text-sm">No live sessions for today.</p>
    ) : (
      <ul className="space-y-3">
        {sessions.map((s, idx) => (
          <li
            key={idx}
            className={`p-4 rounded-lg border ${
              s.isOngoing ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
            } flex justify-between items-center`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500">{s.time}</p>
            </div>
            {s.isOngoing ? (
              <a
                href={s.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-1.5 rounded-md text-xs hover:bg-green-700"
              >
                Join Now
              </a>
            ) : (
              <span className="text-xs text-gray-500">Upcoming</span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LiveSessions;