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
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
        console.log('Timetable data:', timetableData);
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
    return (
      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
        No timetable found.
      </p>
    );

  return (
    <div className="mt-6">
      {/* Desktop View: Grid-based Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-0 border border-gray-200 dark:border-gray-700 rounded-xl bg-base-100 dark:bg-gray-800">
          {/* Header Row */}
          <div className="p-3 font-semibold text-gray-800 dark:text-gray-100 border-b border-r border-gray-200 dark:border-gray-700">
            Period / Day
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Timetable Rows */}
          {PERIOD_DURATIONS.map(({ period, time }) => (
            <React.Fragment key={period}>
              {/* Period Column */}
              <div
                className={`p-3 font-medium text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 ${
                  period === 'lunch' ? 'bg-gray-100 dark:bg-gray-700 italic text-gray-600 dark:text-gray-300' : ''
                }`}
              >
                {period === 'lunch' ? 'Lunch Break' : `Period ${period}`}
                <div className="text-xs text-gray-500 dark:text-gray-400">{time}</div>
              </div>

              {/* Slots for Each Day */}
              {period === 'lunch' ? (
                <div
                  className="col-span-5 p-3 text-center italic text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                >
                  Lunch Break (12:00 PM - 1:00 PM)
                </div>
              ) : (
                DAYS.map((day) => {
                  const slot = timetable.schedule[day]?.find(
                    (s: TimetableSlot) => s.period === period
                  );
                  const teacher = teachers.find((t) => t.id === slot?.teacherId);

                  return (
                    <div
                      key={`${day}-${period}`}
                      className="relative p-3 text-center border-b border-r border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                      onClick={() =>
                        slot?.teacherId
                          ? handleEditClick(day, period as number)
                          : handleAssignClick(day, period as number)
                      }
                    >
                      {slot?.teacherId ? (
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {slot.subject}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {teacher?.name || 'Unknown Teacher'}
                          </p>
                          <div className="flex justify-center gap-2 mt-1">
                            <button
                              className="btn btn-ghost btn-xs rounded-full tooltip"
                              data-tip="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(day, period as number);
                              }}
                            >
                              <PencilIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button
                              className="btn btn-ghost btn-xs rounded-full tooltip"
                              data-tip="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(day, period as number);
                              }}
                            >
                              <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                          <div className="absolute z-10 top-0 left-1/2 hidden -translate-x-1/2 -translate-y-full transform rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
                            Teacher: {teacher?.name || 'Unknown Teacher'}<br />
                            Subject: {slot.subject}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-sm">
                          Free
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile View: Card-based Layout */}
      <div className="block sm:hidden space-y-6">
        {DAYS.map((day) => (
          <div key={day} className="space-y-3">
            <h2 className="text-lg font-semibold text-base-content dark:text-white">
              {day}
            </h2>
            <div className="space-y-3">
              {PERIOD_DURATIONS.map(({ period, time }) => {
                if (period === 'lunch') {
                  return (
                    <div
                      key="lunch"
                      className="card bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center text-gray-600 dark:text-gray-300 italic"
                    >
                      Lunch Break (12:00 PM - 1:00 PM)
                    </div>
                  );
                }

                const slot = timetable.schedule[day]?.find(
                  (s: TimetableSlot) => s.period === period
                );
                const teacher = teachers.find((t) => t.id === slot?.teacherId);

                return (
                  <div
                    key={`${day}-${period}`}
                    className="card bg-base-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      slot?.teacherId
                        ? handleEditClick(day, period as number)
                        : handleAssignClick(day, period as number)
                    }
                  >
                    <div className="flex items-center p-4 gap-4">
                      {/* Period Info */}
                      <div className="w-24 text-center">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          Period {period}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {time}
                        </p>
                      </div>

                      {/* Slot Info */}
                      <div className="flex-1">
                        {slot?.teacherId ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              {slot.subject}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher?.name || 'Unknown Teacher'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      {slot?.teacherId && (
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-ghost btn-sm rounded-full tooltip"
                            data-tip="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(day, period as number);
                            }}
                          >
                            <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm rounded-full tooltip"
                            data-tip="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(day, period as number);
                            }}
                          >
                            <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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