import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadNote } from '../../redux/slices/noteSlice';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

const NoteUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.notes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setUploadError('Title and file are required');
      return;
    }

    setUploadError(null);
    try {
      const fileUrl = await uploadToCloudinary(file);
      if (!fileUrl) {
        setUploadError('Failed to upload file to Cloudinary');
        return;
      }
      await dispatch(uploadNote({ title, fileUrl })).unwrap();
      setTitle('');
      setFile(null);
    } catch (err) {
      setUploadError('Failed to upload note');
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
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};

export default NoteUpload;

