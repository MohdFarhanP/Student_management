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
    <div className='flex'>
      <StudentSidebar />
      <div className="flex-1 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Available Notes</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {notes.map((note: INote) => (
            <li key={note._id} className="flex justify-between items-center p-2 border rounded">
              <span>{note.title}</span>
              <button
                onClick={() => handleDownload(note._id, note.title)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteList;