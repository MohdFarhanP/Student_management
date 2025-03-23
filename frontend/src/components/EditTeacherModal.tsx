import { useEffect, useState } from 'react';
import { ITeacher } from '../pages/admin/Teacher';
import { editTeacher } from '../api/adminApi';

interface EditTeacherModalProps {
  teacherData: ITeacher;
  onClose: () => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  teacherData,
  onClose,
}) => {
  const [formData, setFormData] = useState<ITeacher>(() => ({
    id: teacherData.id,
    name: teacherData.name || '',
    email: teacherData.email || '',
    gender: teacherData.gender || '',
    phoneNo: teacherData.phoneNo || 0,
    empId: teacherData.empId || '',
    assignedClass: teacherData.assignedClass || '',
    subject: teacherData.subject || '',
    dateOfBirth: teacherData.dateOfBirth || '',
    profileImage: teacherData.profileImage || '',
    specialization: teacherData.specialization || '',
    experienceYears: teacherData.experienceYears || 0,
    qualification: teacherData.qualification || '',
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData({
      id: teacherData.id,
      name: teacherData.name || '',
      email: teacherData.email || '',
      gender: teacherData.gender || '',
      phoneNo: teacherData.phoneNo || 0,
      empId: teacherData.empId || '',
      assignedClass: teacherData.assignedClass || '',
      subject: teacherData.subject || '',
      dateOfBirth: teacherData.dateOfBirth || '',
      profileImage: teacherData.profileImage || '',
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }, [teacherData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Consistent validation with trim() for strings
    if (!String(formData.name || '').trim())
      newErrors.name = 'Name is required';
    if (!String(formData.email || '').trim())
      newErrors.email = 'Email is required';
    if (!String(formData.gender || '').trim())
      newErrors.gender = 'Gender is required';
    if (!formData.phoneNo || formData.phoneNo <= 0)
      newErrors.phoneNo = 'Valid phone number is required';
    if (!String(formData.empId || '').trim())
      newErrors.empId = 'Employee ID is required';
    if (!String(formData.assignedClass || '').trim())
      newErrors.assignedClass = 'Assigned Class is required';
    if (!String(formData.subject || '').trim())
      newErrors.subject = 'Subject is required';
    if (!String(formData.dateOfBirth || '').trim())
      newErrors.dateOfBirth = 'Date of Birth is required';

    // Optional fields (only validate if required)
    // if (!String(formData.specialization || '').trim()) newErrors.specialization = 'Specialization is required';
    // if (!formData.experienceYears || formData.experienceYears < 0) newErrors.experienceYears = 'Valid experience is required';
    // if (!String(formData.qualification || '').trim()) newErrors.qualification = 'Qualification is required';

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phoneNo' || name === 'experienceYears') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value ? parseInt(value) : 0,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      console.log('Validation failed, errors:', errors);
      return;
    }

    try {
      const updatedTeacher = await editTeacher(teacherData.id, formData);
      if (updatedTeacher) {
        console.log('Teacher updated successfully:', updatedTeacher);
        onClose();
      }
    } catch (error) {
      console.log('Failed to update teacher:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 text-black shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h3 className="text-xl font-semibold">Edit Teacher</h3>
          <button
            onClick={onClose}
            className="text-lg text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-md border bg-white p-2 text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="number"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.phoneNo && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium">Employee ID</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Employee ID"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.empId && (
              <p className="mt-1 text-xs text-red-500">{errors.empId}</p>
            )}
          </div>

          {/* Assigned Class */}
          <div>
            <label className="block text-sm font-medium">Assigned Class</label>
            <input
              type="text"
              name="assignedClass"
              value={formData.assignedClass}
              onChange={handleChange}
              placeholder="Assigned Class"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.assignedClass && (
              <p className="mt-1 text-xs text-red-500">
                {errors.assignedClass}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-md border bg-white p-2 text-black"
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.specialization && (
              <p className="mt-1 text-xs text-red-500">
                {errors.specialization}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium">
              Experience (Years)
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="Experience Years"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              min="0"
            />
            {errors.experienceYears && (
              <p className="mt-1 text-xs text-red-500">
                {errors.experienceYears}
              </p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
            />
            {errors.qualification && (
              <p className="mt-1 text-xs text-red-500">
                {errors.qualification}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
