import { TimetableSlot } from "../types/timetable";

const TodaysTimetable: React.FC<{ periods: TimetableSlot[] }> = ({ periods }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">Today's Timetable</h2>
    <ul className="space-y-3">
      {periods.map((slot) => (
        <li
          key={slot._id}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-700">Period {slot.period}</p>
            <p className="text-sm text-gray-600">{slot.subject?slot.subject:'not sheduled'}</p>
          </div>
          <p className="text-sm text-indigo-600">{slot.teacherName?slot.teacherName:'not sheduled'}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default TodaysTimetable;
