import { useEffect, useState } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import BulkUploadButton from '../../components/BulkUploadButton';
import { getStudents, IStudent } from '../../api/admin/studentApi';
import ProfileCardStudents from '../../components/ProfileCardStudents';
import EditStudentModal from '../../components/EditStudentModal';
import AddStudentModal from '../../components/AddStudentModal';
import StudentTable from '../../components/StudentTable';

const Student = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [students, setStudents] = useState<IStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetch = async () => {
      const { students, totalCount } = await getStudents(page, limit);
      setStudents(students);
      setTotalCount(totalCount);
    };
    fetch();
  }, [page]);

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddStudent = (newStudent: IStudent) => {
    setStudents((prevStudents) => [newStudent, ...prevStudents]);
    setTotalCount((prevCount) => prevCount + 1);
  };

  const handleUpdateStudent = (updatedStudent: IStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s.id !== studentId)
    );
    setTotalCount((prevCount) => prevCount - 1);
    if (selectedStudent?.id === studentId) setSelectedStudent(null);
  };
  const filterStudent = students.filter((student)=>student.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSideBar />
      <div className="flex flex-1 flex-col px-6 py-4">
        <div className="my-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Students</h1>
          <div className="flex space-x-4">
            <BulkUploadButton role={'Student'} />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Student
            </button>
          </div>
        </div>

        <input
          type="search"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="mb-6 w-xl rounded-lg border border-gray-300 p-2 text-black focus:ring-2 focus:ring-gray-300 focus:outline-none"
          placeholder="Search students by name..."
        />
        

        <div className="flex gap-6">
          <StudentTable
            setSelectedStudent={setSelectedStudent}
            students={filterStudent}
            totalPages={totalPages}
            setIsOpen={setIsEditModalOpen}
            page={page}
            setPage={setPage}
            onDelete={handleDeleteStudent}
          />
          {selectedStudent && (
            <ProfileCardStudents selectedStudent={selectedStudent} />
          )}
        </div>

        {isEditModalOpen && selectedStudent && (
          <EditStudentModal
            studentData={selectedStudent}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateStudent}
          />
        )}
        {isAddModalOpen && (
          <AddStudentModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddStudent}
          />
        )}
      </div>
    </div>
  );
};

export default Student;
