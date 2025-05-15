import React, { useState, useEffect } from 'react';
import { fetchClasses } from '../../api/admin/classApi';
import ClassSelector from '../../components/ClassSelector';
import TimetableTable from '../../components/TimetableTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSideBar from '../../components/AdminSideBar';
import { AxiosError } from 'axios';

export type Class = {
  _id?: string;
  name: string;
};

const TimetableManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // For AdminSideBar

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classesData = await fetchClasses();
        setClasses(classesData || []);
        if (classesData?.length > 0 && classesData[0]._id) {
          setSelectedClassId(classesData[0]._id);
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.message || 'Failed to fetch classes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
            Timetable Management
          </h1>
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
          />
        </div>
        {selectedClassId ? (
          <TimetableTable classId={selectedClassId} />
        ) : (
          <p className="text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
            Please select a class to view the timetable.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimetableManagement;