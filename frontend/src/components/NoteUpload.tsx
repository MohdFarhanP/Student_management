import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadNote } from '../redux/slices/noteSlice';
import { AppDispatch, RootState } from '../redux/store';
import { toast } from 'react-toastify';
import TeacherSidebar from './TeacherSidebar';
import { uploadToS3 } from '../services/UploadToS3';
import { DocumentTextIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';

const NoteUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.notes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setLocalError('Title and file are required');
      return;
    }

    setLocalError(null);
    try {
      const { fileUrl, fileHash } = await uploadToS3(file);
      console.log('Sending to /notes/upload:', { title, fileUrl, fileHash });
      await dispatch(uploadNote({ title, fileUrl, fileHash })).unwrap();
      toast.success('Note uploaded successfully');
      setTitle('');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      const message = err.message || 'Failed to upload note';
      if (message.includes('already exists') && err.response?.data?.data?.fileUrl) {
        setLocalError(`File already exists at: ${err.response.data.data.fileUrl}`);
      } else {
        setLocalError(message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-base-content ml-15 dark:text-white mb-6 sm:text-3xl">
          Upload Note
        </h2>
        <div className="max-w-lg mx-auto">
          <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                    Note Title
                  </label>
                  <div className="flex items-center">
                    <DocumentTextIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Enter note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                    File (PDF, DOC, DOCX)
                  </label>
                  <div className="flex items-center">
                    <PaperClipIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      className="file-input file-input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner"></span>
                      Uploading...
                    </span>
                  ) : (
                    'Upload'
                  )}
                </button>
                {(localError || error) && (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{localError || error}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteUpload;