import React from "react";

interface ClassSubject {
  className: string;
  subject: string;
}

interface MyClassesSubjectsProps {
  data: ClassSubject[];
}

const MyClassesSubjects: React.FC<MyClassesSubjectsProps> = ({ data }) => {
  return (    
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Classes / Subjects</h2>
      <ul className="space-y-3">
        {data.map((item, idx) => (
          <li key={idx} className="flex justify-between text-gray-700 bg-gray-50 px-4 py-2 rounded-md">
            <span className="font-medium">{item.className}</span>
            <span className="text-sm text-gray-500">{item.subject}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyClassesSubjects;
