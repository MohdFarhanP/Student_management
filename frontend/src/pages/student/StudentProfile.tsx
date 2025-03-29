import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchStudentProfile } from '../../redux/slices/studentSlice';
import ProfileCard from '../../components/ProfileCard';
import ClassTable from '../../components/ClassAssignTable';
import { useNavigate } from 'react-router-dom';

const StudentProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.student
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Student') {
      navigate('/login');
    } else {
      dispatch(fetchStudentProfile(user.email));
    }
  }, [user, dispatch, navigate]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold text-black">Student Profile</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileCard
          name={profile?.name ?? user?.email?.split('@')[0] ?? 'Unknown'}
          email={user?.email || ''}
          role="Student"
          additionalInfo={{
            rollNumber: profile?.rollNumber || 'N/A',
            class: profile?.class || 'N/A',
          }}
        />
        <ClassTable classes={profile?.classes || []} />
      </div>
    </div>
  );
};

export default StudentProfile;
