import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../../redux/slices/noteSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { INote } from '../../types/notes';
import StudentSidebar from '../../components/StudentSidebar';

const NoteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDownload = (noteId: string, title: string) => {
    // Create a temporary <a> element to trigger the download
    const link = document.createElement('a');
    link.href = `http://localhost:5000/api/notes/download/${noteId}`; // Backend endpoint
    link.download = `${title}.pdf`; // Set the desired filename (assuming PDF extension)
    document.body.appendChild(link);
    link.click(); // Simulate click to start download
    document.body.removeChild(link); // Clean up
  };
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <StudentSidebar />
      <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-45">
        <h2 className="text-2xl sm:text-3xl pl-[50px] sm:pl-0 font-bold mb-6">Available Notes</h2>
        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note:INote) => (
            <div
              key={note._id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <h3 className="text-lg font-medium truncate mb-3">{note.title}</h3>
              <button
                onClick={() => handleDownload(note._id, note.title)}
                className="mt-auto bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;