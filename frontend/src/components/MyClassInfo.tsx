import React from "react";

const MyClassInfo: React.FC<{ className: string; tutor: string; room: string }> = ({
  className,
  tutor,
  room,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">My Class Info</h2>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Class:</span> {className}
    </p>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Tutor:</span> {tutor}
    </p>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Room:</span> {room}
    </p>
  </div>
);
export default MyClassInfo;