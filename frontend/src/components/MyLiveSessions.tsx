import React from "react";

interface LiveSession {
  title: string;
  className: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}

interface MyLiveSessionsProps {
  sessions: LiveSession[];
  onScheduleNew: () => void;
}

const MyLiveSessions: React.FC<MyLiveSessionsProps> = ({ sessions, onScheduleNew }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Live Sessions</h2>
        <button
          onClick={onScheduleNew}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Schedule New
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session, index) => (
            <li
              key={index}
              className={`p-4 rounded-lg border ${
                session.isOngoing ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
              } flex justify-between items-center`}
            >
              <div>
                <p className="text-md font-semibold text-gray-800">{session.title}</p>
                <p className="text-sm text-gray-600">{session.className}</p>
                <p className="text-xs text-gray-500">{session.time}</p>
              </div>
              {session.isOngoing ? (
                <a
                  href={session.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
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
};

export default MyLiveSessions;
