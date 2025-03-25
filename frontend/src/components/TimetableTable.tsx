import React, { useState, useEffect } from 'react';
import {
  fetchTimetable,
  getTeachersNames,
  assignTeacherToClass,
  updateTimetableSlot,
  deleteTimetableSlot,
} from '../api/adminApi';
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
  _id: string;
  name: string;
};

const TimetableTable: React.FC<TimetableTableProps> = ({ classId }) => {
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
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
        setTimetable(timetableData);
        setTeachers(teachersData);
      } catch (err: unknown) {
        if (err instanceof AxiosError)
          setError(err.message || 'Failed to fetch timetable or teachers');
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
      // Error handling is already done in the API function
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
      // Error handling is already done in the API function
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
      // Error handling is already done in the API function
      console.log(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!timetable)
    return <div className="mt-4 text-center">No timetable found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow-md">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="border-b p-3">Period</th>
            {Object.keys(timetable.schedule).map((day) => (
              <th key={day} className="border-b p-3">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <tr key={period} className="transition-colors hover:bg-gray-50">
              <td className="border-b p-3 text-center font-medium text-gray-700">
                Period {period}
              </td>
              {Object.keys(timetable.schedule).map((day) => {
                const slot = timetable.schedule[day].find(
                  (s: TimetableSlot) => s.period === period
                );
                const teacher = teachers.find((t) => t._id === slot?.teacherId);
                return (
                  <td
                    key={`${day}-${period}`}
                    className="group relative cursor-pointer border-b p-3 text-center"
                    onClick={() =>
                      slot?.teacherId
                        ? handleEditClick(day, period)
                        : handleAssignClick(day, period)
                    }
                  >
                    {slot?.teacherId ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">
                          {slot.subject}
                        </p>
                        <p className="text-sm text-gray-600">
                          {teacher?.name || 'Unknown Teacher'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(day, period);
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                        <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
                          Teacher: {teacher?.name}
                          <br />
                          Subject: {slot.subject}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Free</span>
                    )}
                  </td>
                );
              })}
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
              timetable.schedule[selectedSlot.day].find(
                (s: TimetableSlot) => s.period === selectedSlot.period
              )?.teacherId || '',
            subject:
              timetable.schedule[selectedSlot.day].find(
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
