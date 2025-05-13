import React from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import LiveSessions from '../../components/LiveSessions';
import TodaysTimetable from '../../components/TodaysTimetable';
import MyClassInfo from '../../components/MyClassInfo';
import NotificationBell from '../../components/NotificationBell';

export const StudentDashboard: React.FC = () => {
  const classInfo = {
    className: "Grade 10 - A",
    tutor: "Mrs. Johnson",
    room: "Room 204",
  };

  const timetable = [
    { period: 1, subject: "Mathematics", teacher: "Mr. Smith" },
    { period: 2, subject: "English", teacher: "Ms. Clark" },
    { period: 3, subject: "Biology", teacher: "Dr. Adams" },
    { period: 4, subject: "History", teacher: "Mr. Jones" },
    { period: 5, subject: "Chemistry", teacher: "Mr. Tony" },
  ];

  const liveSessions = [
    {
      title: "Physics Q&A",
      time: "10:00 AM - 10:45 AM",
      isOngoing: true,
      joinLink: "#",
    },
    {
      title: "Math Practice",
      time: "2:00 PM - 3:00 PM",
      isOngoing: false,
      joinLink: "#",
    },
  ];
  return (
    <div className="flex bg-white">
      <StudentSidebar />  
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          <NotificationBell/>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <MyClassInfo {...classInfo} />
          <LiveSessions sessions={liveSessions} />
        </div>
        <TodaysTimetable periods={timetable} />
      </div>
    </div>

  );
};