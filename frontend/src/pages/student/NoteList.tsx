import React, { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadNote, fetchNotes } from '../../redux/slices/noteSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { INote } from '../../types/notes';
import ErrorBoundary from '../../components/ErrorBoundary';

const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));

const NoteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDownload = async (noteId: string) => {
    try {
      const downloadUrl = await dispatch(downloadNote(noteId)).unwrap();
      console.log('Initiating download with URL:', downloadUrl);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert(err instanceof Error ? err.message : 'Failed to download note');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-45">
        <h2 className="text-2xl sm:text-3xl pl-[50px] sm:pl-0 font-bold mb-6">Available Notes</h2>
        <ErrorBoundary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note: INote) => (
              <div
                key={note.id}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="text-lg font-medium truncate mb-3">{note.title}</h3>
                <button
                  onClick={() => handleDownload(note.id)}
                  className="mt-auto bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default NoteList;