import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchStudentProfile,
  updateStudentProfileImage,
} from '../../redux/slices/studentSlice';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import { RiImageEditLine } from 'react-icons/ri';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

const StudentProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.student
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const defaultImage = '/default-avatar.png';

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
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setProfileImage(uploadedUrl);
        dispatch(
          updateStudentProfileImage({
            email: user?.email || '',
            profileImage: uploadedUrl,
          })
        );
        console.log('Uploaded Image URL:', uploadedUrl);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileImage(profile?.profileImage || defaultImage);
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:z-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <StudentSidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 bg-black md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-44 md:p-6">
        {/* Mobile Menu Button */}
        <button
          className="mb-4 rounded-full bg-white p-2 text-black shadow md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="mb-6 text-center text-2xl font-bold text-black md:text-left md:text-3xl">
          Student Profile
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {/* Updated Profile Image Card */}
          <div className="flex max-h-min w-64 flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <label
              htmlFor="profileImageInput"
              className="relative cursor-pointer"
            >
              <img
                src={profileImage || profile?.profileImage || defaultImage}
                alt="Profile"
                className={`mb-4 h-24 w-24 rounded-full border-4 border-gray-200 object-cover shadow-md ${
                  isEditing ? 'transition hover:opacity-80' : 'cursor-default'
                }`}
              />
              {isEditing && (
                <div className="absolute right-2 bottom-2 rounded-full bg-white p-1 text-black shadow">
                  <RiImageEditLine />
                </div>
              )}
            </label>
            {isEditing && (
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            )}
            <h1 className="text-center text-xl font-bold text-gray-800">
              {profile?.name ?? user?.email?.split('@')[0] ?? 'Unknown'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Student</p>
            <button
              onClick={handleEditToggle}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Details Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
              Profile Details
            </h2>
            <div className="space-y-2 text-center text-sm">
              <p className="text-gray-700">Role: Student</p>
              <p className="text-gray-700">Age: {profile?.age || 'N/A'}</p>
              <p className="text-gray-700">
                Gender: {profile?.gender || 'N/A'}
              </p>
              <p className="text-gray-700">
                Roll Number: {profile?.roleNumber || 'N/A'}
              </p>
              <p className="text-gray-700">
                Date of Birth: {profile?.dob || 'N/A'}
              </p>
            </div>
          </div>

          {/* Address Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
              Address Details
            </h2>
            <div className="space-y-2 text-center text-sm">
              <p className="text-gray-700">
                House: {profile?.address?.houseName || 'N/A'}
              </p>
              <p className="text-gray-700">
                Place: {profile?.address?.place || 'N/A'}
              </p>
              <p className="text-gray-700">
                District: {profile?.address?.district || 'N/A'}
              </p>
              <p className="text-gray-700">
                Pincode: {profile?.address?.pincode || 'N/A'}
              </p>
              <p className="text-gray-700">
                Phone: {profile?.address?.phoneNo || 'N/A'}
              </p>
              <p className="text-gray-700">
                Guardian: {profile?.address?.guardianName || 'N/A'}
              </p>
              <p className="text-gray-700">
                Contact: {profile?.address?.guardianContact || 'N/A'}
              </p>
            </div>
          </div>

          {/* Current Class Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-center text-lg font-semibold text-gray-800">
              Current Class
            </h2>
            <div className="text-center text-sm">
              <p className="text-gray-700">Class: {profile?.class || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
