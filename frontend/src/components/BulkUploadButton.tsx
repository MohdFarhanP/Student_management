import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import {
  studentsBulkUpload,
  teachersBulkUpload,
} from '../api/admin/bulkUploadApi';

const BulkUploadButton = ({ role }: { role: string }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Only Excel files (.xlsx, .xls) are allowed!');
      return;
    }
    if (role === 'Student') {
      await studentsBulkUpload(file);
    } else if (role === 'Teacher') {
      await teachersBulkUpload(file);
    } else {
      toast.error('Please make sure your sheetName is Students or Teachers');
      console.log(role);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileUpload}
      />
      <button
        className="btn btn-primary btn-sm sm:btn-md"
        onClick={() => fileInputRef.current?.click()}
      >
        Bulk Upload
      </button>
    </div>
  );
};

export default React.memo(BulkUploadButton);