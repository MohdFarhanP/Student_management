import React, { Suspense, lazy, useState, useEffect } from 'react';
import { fetchClasses } from '../../api/admin/classApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import { AxiosError } from 'axios';

interface Class {
  _id: string;
  name: string;
  chatRoomId?:string;
  section?: string;
  grade?: string;
}

// Lazy-load components
const AdminSideBar = lazy(() => import('../../components/AdminSideBar'));
const ClassSelector = lazy(() => import('../../components/ClassSelector'));
const TimetableTable = lazy(() => import('../../components/TimetableTable'));

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
        if (classesData!.length > 0 && classesData![0]._id) {
          setSelectedClassId(classesData![0]._id);
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
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Suspense>
      </ErrorBoundary>
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
            Timetable Management
          </h1>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ClassSelector
                classes={classes}
                selectedClassId={selectedClassId}
                onSelectClass={setSelectedClassId}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        {selectedClassId ? (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <TimetableTable classId={selectedClassId} />
            </Suspense>
          </ErrorBoundary>
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