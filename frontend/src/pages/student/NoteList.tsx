import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, downloadNote } from '../../redux/slices/noteSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { INote } from '../../types/notes';

const NoteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDownload = (noteId: string, title: string) => {
    dispatch(downloadNote(noteId)).then((action) => {
      if (downloadNote.fulfilled.match(action)) {
        const link = document.createElement('a');
        link.href = action.payload; // Use signed URL
        link.setAttribute('download', title);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
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
  );
};

export default NoteList;