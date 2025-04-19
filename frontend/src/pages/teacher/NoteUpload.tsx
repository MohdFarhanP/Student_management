import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadNote } from '../../redux/slices/noteSlice';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

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
      const fileUrl = await uploadToCloudinary(file);
      await dispatch(uploadNote({ title, fileUrl })).unwrap();
      toast.success('Note uploaded successfully');
      setTitle('');
      setFile(null);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to upload note');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Note</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {localError && <p className="text-red-500">{localError}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default NoteUpload;

