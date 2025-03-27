import { useRef } from 'react';
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
    console.log('event.target.files', event.target.files);
    const file = event.target.files?.[0];
    console.log('file before ', file);
    if (!file) return;
    console.log('file after ', file);
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Only Excel files (.xlsx, .xls) are allowed!');
      return;
    }
    if (role == 'Student') {
      await studentsBulkUpload(file);
    } else if (role == 'Teacher') {
      await teachersBulkUpload(file);
    } else {
      toast.error('please make sure your sheetName Students or Teachers');
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
        className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-80"
        onClick={() => fileInputRef.current?.click()}
      >
        Bulk Upload
      </button>
    </div>
  );
};

export default BulkUploadButton;
