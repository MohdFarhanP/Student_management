import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchTeacherProfile,
  updateTeacherProfile,
} from '../../redux/slices/teacherSlice';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import { IoCameraOutline } from 'react-icons/io5';
import defaultImg from '../../assets/profile.jpg';
import { uploadToS3 } from '../../services/UploadToS3';
import { toast } from 'react-toastify';

interface TeacherProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  empId: string;
  assignedClass?: string | null;
  subject?: string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
}

const TeacherProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.teacher
  );
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<Partial<TeacherProfile> | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<TeacherProfile>>({});

  useEffect(() => {
    if (!user || user.role !== 'Teacher') {
      navigate('/login');
    } else {
      dispatch(fetchTeacherProfile(user.email));
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setFormErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'experienceYears' ? Number(value) : value,
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { fileUrl, fileHash } = await uploadToS3(file);
        console.log('Uploaded Image URL:', { fileUrl, fileHash });
        setEditedProfile((prev) => {
          if (!prev) return prev;
          return { ...prev, profileImage: fileUrl, fileHash };
        });
      } catch (err) {
        console.error('Image upload failed:', err);
        toast.error('Failed to upload image. Please try again.');
      }
    }
  };


  const validateForm = (): boolean => {
    const errors: Partial<TeacherProfile> = {};
    if (!editedProfile?.name) errors.name = 'Name is required';
    if (!editedProfile?.phoneNo || !/^\d{10}$/.test(editedProfile.phoneNo))
      errors.phoneNo = 'Please enter a valid 10-digit phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (editedProfile) {
      try {
        const result = await dispatch(
          updateTeacherProfile(editedProfile)
        ).unwrap();
        if (result) {
          setIsEditing(false);
        }
      } catch (err) {
        console.error('Failed to update profile:', err);
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  if (loading)
    return (
      <div className="mt-20 bg-black/75 text-center text-white">Loading...</div>
    );
  if (error)
    return (
      <div className="mt-20 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherSidebar />

      <div className="flex flex-1 items-start justify-center bg-[#E6F0FA] p-6">
        <div className="max-w-5xl space-y-6">

          <div className="flex gap-6">
            {/* Profile Picture and Name Card */}
            <div className="flex max-h-min w-64 flex-col items-center rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
              <label
                htmlFor="profileImageInput"
                className="relative cursor-pointer"
              >
                <img
                  src={
                    editedProfile?.profileImage ||
                    profile?.profileImage ||
                    defaultImg
                  }
                  alt="Profile"
                  className={`mb-4 h-24 w-24 rounded-full border-4 border-gray-200 object-cover shadow-md dark:border-gray-600 ${
                    isEditing ? 'transition hover:opacity-80' : 'cursor-default'
                  }`}
                />
                {isEditing && (
                  <div className="absolute right-2 bottom-2 rounded-full bg-white p-1 text-black shadow dark:bg-gray-700 dark:text-gray-200">
                    <IoCameraOutline />
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

              <h1 className="text-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {profile?.name ?? user?.email?.split('@')[0] ?? 'Unknown'}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Teacher
              </p>

              <button
                onClick={handleEditToggle}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {/* General Information */}
            <div className="flex-1 rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
              <div className="mb-4 flex items-center justify-between pb-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Name:</strong>{' '}
                    {profile?.name ?? 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Email:</strong>{' '}
                    {user?.email ?? 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Gender:</strong>{' '}
                    {profile?.gender ?? 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Phone:</strong>{' '}
                    {profile?.phoneNo?.toString() ?? 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Employee ID:</strong>{' '}
                    {profile?.empId ?? 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Date of Birth:</strong>{' '}
                    {profile?.dateOfBirth ?? 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Specialization:</strong>{' '}
                    {profile?.specialization || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Experience:</strong>{' '}
                    {`${profile?.experienceYears ?? 0} years`}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Qualification:</strong>{' '}
                    {profile?.qualification || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong className="font-medium">Assigned Class:</strong>{' '}
                    {profile?.assignedClass ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Section (Appears Below When Editing) */}
          {isEditing && editedProfile && (
            <div className="flex justify-center">
              <div className="w-full max-w-5xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
                <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Edit Profile
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editedProfile.name || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500 dark:text-red-400">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email || ''}
                        onChange={handleInputChange}
                        className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-500"
                        disabled
                        hidden
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={editedProfile.phoneNo || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      />
                      {formErrors.phoneNo && (
                        <p className="text-sm text-red-500 dark:text-red-400">
                          {formErrors.phoneNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Qualification
                      </label>
                      <select
                        name="qualification"
                        value={editedProfile.qualification || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      >
                        <option value="">Select qualification</option>
                        <option value="D.El.Ed">
                          D.El.Ed (Diploma in Elementary Education)
                        </option>
                        <option value="B.Ed">
                          B.Ed (Bachelor of Education)
                        </option>
                        <option value="B.El.Ed">
                          B.El.Ed (Bachelor of Elementary Education)
                        </option>
                        <option value="M.Ed">M.Ed (Master of Education)</option>
                        <option value="BA_BEd">B.A + B.Ed</option>
                        <option value="BSc_BEd">B.Sc + B.Ed</option>
                        <option value="MA_BEd">M.A + B.Ed</option>
                        <option value="MSc_BEd">M.Sc + B.Ed</option>
                        <option value="TET_Qualified">
                          TET Qualified (CTET / State TET)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editedProfile.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={editedProfile.specialization || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={editedProfile.experienceYears || 0}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-700"
                      />
                    </div>
                    <div className="mt-4 mr-2 flex justify-end gap-2">
                      <button
                        onClick={handleEditToggle}
                        className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
