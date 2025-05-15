import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchClasses } from '../../redux/slices/classSlice';
import PaginationButton from '../../components/PaginationButton';
import Modal from '../../components/Modal';
import AdminSideBar from '../../components/AdminSideBar';
import ClassTable from '../../components/ClassTable';

const Class = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [isOpen, setIsOpen] = useState(false); // For AdminSideBar

  const dispatch = useDispatch<AppDispatch>();
  const { classes, totalCount } = useSelector(
    (state: RootState) => state.classes
  );

  useEffect(() => {
    dispatch(fetchClasses({ page, limit }));
  }, [dispatch, page]);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 1;

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        {/* Header */}
        <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
            Classes
          </h1>
          <div className="flex justify-end">
            <Modal />
          </div>
        </div>

        {/* Class List */}
        <ClassTable data={classes ?? []} />

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <PaginationButton
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Class;