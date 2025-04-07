import { useState } from 'react';
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
        name === 'phoneNo' || name === 'experienceYears'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-semibold text-black">Add Teacher</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-lg text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Name"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border p-2 text-black"
              disabled={isSubmitting}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Phone Number
            </label>
            <input
              type="number"
              name="phoneNo"
              value={formData.phoneNo || ''}
              onChange={handleChange}
              placeholder="Phone Number"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.phoneNo && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Employee ID
            </label>
            <input
              type="text"
              name="empId"
              value={formData.empId || ''}
              onChange={handleChange}
              placeholder="Employee ID"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.empId && (
              <p className="mt-1 text-xs text-red-500">{errors.empId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Assigned Class
            </label>
            <input
              type="text"
              name="assignedClass"
              value={formData.assignedClass || ''}
              onChange={handleChange}
              placeholder="Assigned Class (e.g., 10B)"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.assignedClass && (
              <p className="mt-1 text-xs text-red-500">
                {errors.assignedClass}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-black"
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleChange}
              placeholder="Specialization"
              className="mt-1 w-full rounded-md border p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-2 mt-6 flex justify-end space-x-3 text-black">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
  );
};

export default AddTeacherModal;
