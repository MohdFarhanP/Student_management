import React from "react";
import { IClassData } from "../api/admin/classApi";

const MyClassInfo: React.FC<Partial<IClassData>> = ({
  name,
  tutor,
  roomNo,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">My Class Info</h2>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Class:</span> {name}
    </p>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Tutor:</span> {tutor}
    </p>
    <p className="text-sm text-gray-700">
      <span className="font-medium">Room:</span> {roomNo}
    </p>
  </div>
);
export default MyClassInfo;