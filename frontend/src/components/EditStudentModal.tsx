import React, { useState } from 'react';
import { IStudent, editStudent } from '../api/admin/studentApi';

interface EditStudentModalProps {
  studentData: IStudent;
  onClose: () => void;
  onUpdate?: (updatedStudent: IStudent) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  studentData,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<IStudent>>(studentData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.roleNumber?.trim())
      newErrors.roleNumber = 'Role Number is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.age || formData.age <= 0)
      newErrors.age = 'Valid age is required';
    if (!formData.address?.houseName?.trim())
      newErrors.houseName = 'House Name is required';
    if (!formData.address?.place?.trim()) newErrors.place = 'Place is required';
    if (!formData.address?.district?.trim())
      newErrors.district = 'District is required';
    if (!formData.address?.pincode || Number(formData.address.pincode) <= 0)
      newErrors.pincode = 'Valid pincode is required';
    if (!formData.address?.phoneNo || Number(formData.address.phoneNo) <= 0)
      newErrors.phoneNo = 'Valid phone number is required';
    if (!formData.address?.guardianName?.trim())
      newErrors.guardianName = 'Guardian Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      [
        'houseName',
        'place',
        'district',
        'pincode',
        'phoneNo',
        'guardianName',
        'guardianContact',
      ].includes(name)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]:
            name === 'pincode' || name === 'phoneNo'
              ? value
                ? parseInt(value, 10)
                : 0
              : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'age' ? (value ? parseInt(value, 10) : 0) : value,
      }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedStudent = await editStudent(studentData.id, formData);
      if(updatedStudent) onUpdate?.(updatedStudent);
      onClose();
    } catch (error) {
      console.error('Failed to edit student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl bg-base-100 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white">
            Edit Student
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
                Role Number
              </label>
              <input
                type="text"
                name="roleNumber"
                value={formData.roleNumber || ''}
                onChange={handleChange}
                placeholder="Role Number"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.roleNumber && (
                <p className="mt-1 text-xs text-error">{errors.roleNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ''}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.dob && (
                <p className="mt-1 text-xs text-error">{errors.dob}</p>
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
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                placeholder="Age"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-error">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={formData.class || ''}
                onChange={handleChange}
                placeholder="Class (e.g., 10B)"
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
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                House Name
              </label>
              <input
                type="text"
                name="houseName"
                value={formData.address?.houseName || ''}
                onChange={handleChange}
                placeholder="House Name"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.houseName && (
                <p className="mt-1 text-xs text-error">{errors.houseName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Place
              </label>
              <input
                type="text"
                name="place"
                value={formData.address?.place || ''}
                onChange={handleChange}
                placeholder="Place"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.place && (
                <p className="mt-1 text-xs text-error">{errors.place}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.address?.district || ''}
                onChange={handleChange}
                placeholder="District"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.district && (
                <p className="mt-1 text-xs text-error">{errors.district}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Pincode
              </label>
              <input
                type="number"
                name="pincode"
                value={formData.address?.pincode || ''}
                onChange={handleChange}
                placeholder="Pincode"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.pincode && (
                <p className="mt-1 text-xs text-error">{errors.pincode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNo"
                value={formData.address?.phoneNo || ''}
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
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.address?.guardianName || ''}
                onChange={handleChange}
                placeholder="Guardian Name"
                className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              />
              {errors.guardianName && (
                <p className="mt-1 text-xs text-error">{errors.guardianName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                Guardian Contact
              </label>
              <input
                type="text"
                name="guardianContact"
                value={formData.address?.guardianContact || ''}
                onChange={handleChange}
                placeholder="Guardian Contact"
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
                {isSubmitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditStudentModal);