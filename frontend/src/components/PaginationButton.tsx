import React from 'react';

interface PaginationButtonProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="mr-40 flex justify-center space-x-2 pt-2 sm:justify-end">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
          page === 1
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'border bg-black text-white hover:bg-white hover:text-black'
        }`}
      >
        Previous
      </button>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page >= totalPages}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
          page >= totalPages
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'border bg-black text-white hover:bg-white hover:text-black'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButton;
