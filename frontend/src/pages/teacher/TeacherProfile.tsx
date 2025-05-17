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
import { UserIcon, PhoneIcon, CalendarIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
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
      }t
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <div className="alert alert-error shadow-lg max-w-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold ml-15 text-base-content dark:text-white">
            Profile
          </h2>
          {/* Profile Picture and General Information */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile Picture Card */}
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl w-full sm:w-64">
              <div className="card-body items-center text-center">
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
                    className={`mb-4 h-24 w-24 rounded-full border-4 border-base-200 dark:border-gray-600 object-cover ${
                      isEditing ? 'hover:opacity-80 transition' : 'cursor-default'
                    }`}
                  />
                  {isEditing && (
                    <div className="absolute right-2 bottom-2 rounded-full bg-base-100 dark:bg-gray-800 p-1.5 text-primary dark:text-primary-content shadow">
                      <IoCameraOutline size={20} />
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
                  />
                )}
                <h1 className="text-xl font-bold text-base-content dark:text-white">
                  {profile?.name ?? user?.email?.split('@')[0] ?? 'Unknown'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Teacher
                </p>
                <button
                  onClick={handleEditToggle}
                  className="btn btn-primary btn-sm mt-4 w-full"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* General Information Card */}
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl flex-1">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-base-content dark:text-white">
                  General Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Name:</strong>{' '}
                      {profile?.name ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Email:</strong>{' '}
                      {user?.email ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Gender:</strong>{' '}
                      {profile?.gender ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Phone:</strong>{' '}
                      {profile?.phoneNo ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Employee ID:</strong>{' '}
                      {profile?.empId ?? 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Date of Birth:</strong>{' '}
                      {profile?.dateOfBirth ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Specialization:</strong>{' '}
                      {profile?.specialization ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Experience:</strong>{' '}
                      {`${profile?.experienceYears ?? 0} years`}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Qualification:</strong>{' '}
                      {profile?.qualification ?? 'N/A'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Assigned Class:</strong>{' '}
                      {profile?.assignedClass ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Section */}
          {isEditing && editedProfile && (
            <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-base-content dark:text-white">
                  Edit Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <div className="flex items-center">
                        <UserIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          value={editedProfile.name || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-sm text-error mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <div className="flex items-center">
                        <PhoneIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="tel"
                          name="phoneNo"
                          value={editedProfile.phoneNo || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        />
                      </div>
                      {formErrors.phoneNo && (
                        <p className="text-sm text-error mt-1">
                          {formErrors.phoneNo}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Qualification
                      </label>
                      <div className="flex items-center">
                        <AcademicCapIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <select
                          name="qualification"
                          value={editedProfile.qualification || ''}
                          onChange={handleInputChange}
                          className="select select-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        >
                          <option value="">Select qualification</option>
                          <option value="D.El.Ed">D.El.Ed (Diploma in Elementary Education)</option>
                          <option value="B.Ed">B.Ed (Bachelor of Education)</option>
                          <option value="B.El.Ed">B.El.Ed (Bachelor of Elementary Education)</option>
                          <option value="M.Ed">M.Ed (Master of Education)</option>
                          <option value="BA_BEd">B.A + B.Ed</option>
                          <option value="BSc_BEd">B.Sc + B.Ed</option>
                          <option value="MA_BEd">M.A + B.Ed</option>
                          <option value="MSc_BEd">M.Sc + B.Ed</option>
                          <option value="TET_Qualified">TET Qualified (CTET / State TET)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth
                      </label>
                      <div className="flex items-center">
                        <CalendarIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editedProfile.dateOfBirth || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Specialization
                      </label>
                      <div className="flex items-center">
                        <BriefcaseIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="specialization"
                          value={editedProfile.specialization || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Experience (years)
                      </label>
                      <div className="flex items-center">
                        <BriefcaseIcon className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="number"
                          name="experienceYears"
                          value={editedProfile.experienceYears || 0}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={handleEditToggle}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-sm"
                  >
                    Save Changes
                  </button>
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