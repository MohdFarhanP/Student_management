import React, { lazy, Suspense, useState } from 'react';
import { deleteTeacher } from '../api/admin/teacherApi';
import { deleteStudent, IStudent } from '../api/admin/studentApi';
import TableRowCard from './TableRowCard';
import { ITeacher } from '../pages/admin/Teacher';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

const PaginationButton = lazy(() => import('./PaginationButton'));
const ConfirmDialog = lazy(() => import('./ConfirmDialog'));

type ItemType = 'student' | 'teacher';
interface StudentTeacherTableProps<T> {
  data: T[];
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedItem: (item: T | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: (itemId: string) => void;
  itemType: ItemType;
}
const StudentTeacherTable = <T extends ITeacher | IStudent>({
  data,
  totalPages,
  page,
  setPage,
  setSelectedItem,
  setIsOpen,
  onDelete,
  itemType,
}: StudentTeacherTableProps<T>) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [IdToDelete, setIdToDelete] = useState<string | null>(null);

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleDelete = (studentId: string) => {
    setIdToDelete(studentId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!IdToDelete) return;
    try {
      if (itemType === 'teacher') {
        await deleteTeacher(IdToDelete);
      } else {
        await deleteStudent(IdToDelete);
      }
      onDelete(IdToDelete);
      setIsConfirmOpen(false);
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      setIsConfirmOpen(false);
      setIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setIdToDelete(null);
  };

  return (
    <div className="flex-1">
      {/* Student Cards */}
      <TableRowCard
        data={data}
        setSelectedItem={setSelectedItem}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PaginationButton
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Confirmation Dialog */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ConfirmDialog
            isOpen={isConfirmOpen}
            message="Are you sure you want to delete this student?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default React.memo(StudentTeacherTable);
