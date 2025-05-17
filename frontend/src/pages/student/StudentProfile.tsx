import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchStudentProfile,
  updateStudentProfileImage,
} from '../../redux/slices/studentSlice';
import { useNavigate } from 'react-router-dom';
import { RiImageEditLine } from 'react-icons/ri';
import defaultImage from '../../assets/profile.jpg';
import { uploadToS3 } from '../../services/UploadToS3';
import { toast } from 'react-toastify';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load components
const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));

const StudentProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.student
  );

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'Student') {
      navigate('/login');
    } else {
      dispatch(fetchStudentProfile(user.email));
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (profile?.profileImage) {
      setProfileImage(profile.profileImage);
    }
  }, [profile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    setUploadError(null);

    try {
      const { fileUrl, fileHash } = await uploadToS3(file);
      console.log('Uploaded Image URL:', { fileUrl, fileHash });

      await dispatch(
        updateStudentProfileImage({
          email: user?.email || '',
          profileImage: fileUrl,
        })
      ).unwrap();

      setProfileImage(fileUrl);
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setUploadError(message);
      toast.error(message);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileImage(profile?.profileImage || defaultImage);
      setUploadError(null);
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading)
    return <div className="bg-black/75 p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-45">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left text-gray-800 dark:text-gray-100">
          Student Profile
        </h1>

        <ErrorBoundary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <label
                htmlFor="profileImageInput"
                className="relative cursor-pointer"
              >
                <img
                  src={profileImage || profile?.profileImage || defaultImage}
                  alt="Profile"
                  className={`mb-4 h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover shadow-md ${
                    isEditing ? 'hover:opacity-80 transition' : 'cursor-default'
                  }`}
                />
                {isEditing && (
                  <div className="absolute right-1 bottom-1 rounded-full bg-white dark:bg-gray-700 p-1.5 text-black dark:text-gray-100 shadow">
                    <RiImageEditLine size={16} />
                  </div>
                )}
              </label>
              {isEditing && (
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              )}
              {uploadLoading && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 text-center">
                {profile?.name ?? user?.email?.split('@')[0] ?? 'Unknown'}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Student</p>
              <button
                onClick={handleEditToggle}
                className="mt-4 rounded-lg bg-blue-500 dark:bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Profile Details
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                <p>Role: Student</p>
                <p>Age: {profile?.age || 'N/A'}</p>
                <p>Gender: {profile?.gender || 'N/A'}</p>
                <p>Roll Number: {profile?.roleNumber || 'N/A'}</p>
                <p>
                  Date of Birth:{' '}
                  {profile?.dob
                    ? new Date(profile.dob).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Address Details
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                <p>House: {profile?.address?.houseName || 'N/A'}</p>
                <p>Place: {profile?.address?.place || 'N/A'}</p>
                <p>District: {profile?.address?.district || 'N/A'}</p>
                <p>Pincode: {profile?.address?.pincode || 'N/A'}</p>
                <p>Phone: {profile?.address?.phoneNo || 'N/A'}</p>
                <p>Guardian: {profile?.address?.guardianName || 'N/A'}</p>
                <p>Contact: {profile?.address?.guardianContact || 'N/A'}</p>
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Current Class
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                <p>Class: {profile?.class || 'N/A'}</p>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default StudentProfile;