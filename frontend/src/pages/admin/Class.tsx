import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchClasses } from '../../redux/slices/classSlice';
import PaginationButton from '../../components/PaginationButton';
import Modal from '../../components/Modal';
import AdminSideBar from '../../components/AdminSideBar';
import UserTable from '../../components/UserTable';

const Class = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const dispatch = useDispatch<AppDispatch>();
  const { classes, totalCount } = useSelector(
    (state: RootState) => state.classes
  );

  useEffect(() => {
    dispatch(fetchClasses({ page, limit }));
  }, [dispatch, page]);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 1;

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col px-6 py-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Classes</h1>

        {/* Add Class Button */}
        <div className="mb-4 flex justify-end">
          <Modal />
        </div>

        {/* Class Table */}
        <UserTable data={classes ?? []} />

        {/* Pagination */}
        <PaginationButton
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Class;
