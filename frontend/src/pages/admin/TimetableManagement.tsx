import React, { useState, useEffect } from 'react';
import { fetchClasses } from '../../api/admin/classApi';
import ClassSelector from '../../components/ClassSelector';
import TimetableTable from '../../components/TimetableTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSideBar from '../../components/AdminSideBar';
import { AxiosError } from 'axios';

export type Class = {
  _id: string;
  name: string;
};

const TimetableManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classesData = await fetchClasses();
        setClasses(classesData);
        if (classesData.length > 0) {
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
    <div className="flex bg-white">
      <AdminSideBar />
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Timetable Management
        </h1>
        <ClassSelector
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
        />
        {selectedClassId && <TimetableTable classId={selectedClassId} />}
      </div>
    </div>
  );
};

export default TimetableManagement;
