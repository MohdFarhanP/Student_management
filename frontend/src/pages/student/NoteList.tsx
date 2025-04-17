import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, downloadNote } from '../../redux/slices/noteSlice';

const NoteList = () => {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDownload = (noteId, title) => {
    dispatch(downloadNote(noteId)).then((action) => {
      if (action.payload) {
        const link = document.createElement('a');
        link.href = action.payload; // Cloudinary URL
        link.setAttribute('download', title);
        link.setAttribute('target', '_blank'); // Open in new tab to trigger download
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
      {error && <p className="text-red-500">{error.message}</p>}
      <ul className="space-y-2">
        {notes.map((note) => (
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
