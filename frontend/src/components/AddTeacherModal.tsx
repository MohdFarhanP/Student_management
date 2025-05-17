import React, { useState, memo } from 'react';
import { ITeacher } from '../pages/admin/Teacher';
import { addTeacher } from '../api/admin/teacherApi';
import { TbFidgetSpinner } from 'react-icons/tb';

interface AddTeacherModalProps {
  onClose: () => void;
  onAdd?: (newTeacher: ITeacher) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Partial<ITeacher>>({
    name: '',
    email: '',
    gender: '',
    phoneNo: 0,
    empId: '',
    assignedClass: '',
    dateOfBirth: '',
    profileImage: '',
    specialization: '',
    experienceYears: 0,
    qualification: '',
    age: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phoneNo || formData.phoneNo <= 0)
      newErrors.phoneNo = 'Valid phone number is required';
    if (!formData.empId?.trim()) newErrors.empId = 'Employee ID is required';
    if (!formData.assignedClass?.trim())
      newErrors.assignedClass = 'Assigned Class is required';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of Birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === 'phoneNo' || name === 'experienceYears' || name === 'age'
          ? value
            ? parseInt(value, 10)
            : 0
          : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newTeacher = await addTeacher(formData);
      onAdd?.(newTeacher);
      onClose();
    } catch (error) {
      console.error('Failed to add teacher:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl bg-base-100 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white">
            Add Teacher
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-sm btn-circle btn-ghost text-gray-600 dark:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Name"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-error">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Email"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-error">{errors.gender}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNo"
                value={formData.phoneNo || ''}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.phoneNo && (
                <p className="mt-1 text-xs text-error">{errors.phoneNo}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Employee ID
              </label>
              <input
                type="text"
                name="empId"
                value={formData.empId || ''}
                onChange={handleChange}
                placeholder="Employee ID"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.empId && (
                <p className="mt-1 text-xs text-error">{errors.empId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Assigned Class
              </label>
              <input
                type="text"
                name="assignedClass"
                value={formData.assignedClass || ''}
                onChange={handleChange}
                placeholder="Assigned Class (e.g., 10B)"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.assignedClass && (
                <p className="mt-1 text-xs text-error">{errors.assignedClass}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-error">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleChange}
                placeholder="Specialization"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject || ''}
                onChange={handleChange}
                placeholder="Subject"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears || ''}
                onChange={handleChange}
                placeholder="Experience Years"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification || ''}
                onChange={handleChange}
                placeholder="Qualification"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Profile Image
              </label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage || ''}
                onChange={handleChange}
                placeholder="Image URL"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
            </div>
            <div className="col-span-1 sm:col-span-2 mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-sm sm:btn-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="mx-auto flex items-center gap-2">
                    <TbFidgetSpinner className="animate-spin" />
                    Adding
                  </span>
                ) : (
                  'Add Teacher'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(AddTeacherModal);