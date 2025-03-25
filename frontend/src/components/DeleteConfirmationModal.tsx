import React from 'react';

type DeleteConfirmationModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Confirm Deletion
        </h2>
        <p className="mb-4 text-gray-600">
          Are you sure you want to delete this timetable slot? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
