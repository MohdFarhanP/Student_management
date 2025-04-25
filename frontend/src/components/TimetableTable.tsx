import React, { useState, useEffect } from 'react';
import {
  fetchTimetable,
  updateTimetableSlot,
  deleteTimetableSlot,
  assignTeacherToClass,
} from '../api/admin/timeTableApi';
import { getTeachersNames } from '../api/admin/teacherApi';
import { TimetableData, TimetableSlot } from '../types/timetable/index';
import AssignEditModal from './AssignEditModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { AxiosError } from 'axios';

type TimetableTableProps = {
  classId: string;
};

type Teacher = {
  id: string;
  name: string;
};

const PERIOD_DURATIONS = [
  { period: 1, time: '9:00 AM - 10:00 AM' },
  { period: 2, time: '10:00 AM - 11:00 AM' },
  { period: 3, time: '11:00 AM - 12:00 PM' },
  { period: 'lunch', time: '12:00 PM - 1:00 PM (Lunch)' },
  { period: 4, time: '1:00 PM - 2:00 PM' },
  { period: 5, time: '2:00 PM - 3:00 PM' },
  { period: 6, time: '3:00 PM - 4:00 PM' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimetableTable: React.FC<TimetableTableProps> = ({ classId }) => {
  const [timetable, setTimetable] = useState<TimetableData>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    period: number;
  } | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<{
    day: string;
    period: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [timetableData, teachersData] = await Promise.all([
          fetchTimetable(classId),
          getTeachersNames(),
        ]);
        console.log('this way timetable data getting ',timetableData)
        setTimetable(timetableData);
        setTeachers(teachersData ?? []);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.message || 'Failed to fetch timetable or teachers');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const handleAssignClick = (day: string, period: number) => {
    setSelectedSlot({ day, period });
    setIsAssignModalOpen(true);
  };

  const handleEditClick = (day: string, period: number) => {
    setSelectedSlot({ day, period });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (day: string, period: number) => {
    setSlotToDelete({ day, period });
    setIsDeleteModalOpen(true);
  };

  const handleAssign = async (data: { teacherId: string; subject: string }) => {
    if (!selectedSlot) return;

    try {
      const updatedTimetable = await assignTeacherToClass(classId, {
        day: selectedSlot.day,
        period: selectedSlot.period,
        teacherId: data.teacherId,
        subject: data.subject,
      });
      setTimetable(updatedTimetable);
      setIsAssignModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (data: { teacherId: string; subject: string }) => {
    if (!selectedSlot) return;

    try {
      const updatedTimetable = await updateTimetableSlot(classId, {
        day: selectedSlot.day,
        period: selectedSlot.period,
        teacherId: data.teacherId,
        subject: data.subject,
      });
      setTimetable(updatedTimetable);
      setIsEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!slotToDelete) return;

    try {
      const updatedTimetable = await deleteTimetableSlot(classId, {
        day: slotToDelete.day,
        period: slotToDelete.period,
      });
      setTimetable(updatedTimetable);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!timetable)
    return <div className="mt-4 text-center text-gray-600">No timetable found.</div>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4 text-left font-semibold">Period</th>
            {DAYS.map((day) => (
              <th key={day} className="p-4 text-center font-semibold">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIOD_DURATIONS.map(({ period, time }) => (
            <tr
              key={period}
              className={`transition-colors ${period === 'lunch' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <td
                className={`p-4 font-medium text-gray-800 ${
                  period === 'lunch' ? 'text-center italic text-gray-600' : ''
                }`}
              >
                {period === 'lunch' ? 'Lunch Break' : `Period ${period}`}
                <div className="text-xs text-gray-500">{time}</div>
              </td>
              {period === 'lunch' ? (
                <td
                  colSpan={DAYS.length}
                  className="p-4 text-center bg-gray-100 text-gray-600 italic"
                >
                  Lunch Break (12:00 PM - 1:00 PM)
                </td>
              ) : (
                DAYS.map((day) => {
                  
                  const slot = timetable.schedule[day]?.find(
                    (s: TimetableSlot) => s.period === period
                  );
                  const teacher = teachers.find((t) => t.id === slot?.teacherId);
                  return (
                    <td
                      key={`${day}-${period}`}
                      className="group relative cursor-pointer p-4 text-center border-r border-gray-200"
                      onClick={() =>
                        slot?.teacherId
                          ? handleEditClick(day, period as number)
                          : handleAssignClick(day, period as number)
                      }
                    >
                      {slot?.teacherId ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-800">{slot.subject}</p>
                          <p className="text-sm text-gray-600">
                            {teacher?.name || 'Unknown Teacher'}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(day, period as number);
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                          <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
                            Teacher: {teacher?.name || 'Unknown Teacher'}
                            <br />
                            Subject: {slot.subject}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Free</span>
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {isAssignModalOpen && selectedSlot && (
        <AssignEditModal
          mode="assign"
          teachers={teachers}
          classId={classId}
          onSubmit={handleAssign}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}
      {isEditModalOpen && selectedSlot && (
        <AssignEditModal
          mode="edit"
          teachers={teachers}
          classId={classId}
          initialData={{
            teacherId:
              timetable.schedule[selectedSlot.day]?.find(
                (s: TimetableSlot) => s.period === selectedSlot.period
              )?.teacherId || '',
            subject:
              timetable.schedule[selectedSlot.day]?.find(
                (s: TimetableSlot) => s.period === selectedSlot.period
              )?.subject || '',
          }}
          onSubmit={handleEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && slotToDelete && (
        <DeleteConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TimetableTable;