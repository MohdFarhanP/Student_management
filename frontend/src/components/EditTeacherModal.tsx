import { useEffect, useState } from 'react';
import { ITeacher } from '../pages/admin/Teacher';
import { editTeacher } from '../api/admin/teacherApi';

interface EditTeacherModalProps {
  teacherData: ITeacher;
  onClose: () => void;
  onEdit: (updatedTeacher: ITeacher) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  teacherData,
  onClose,
  onEdit,
}) => {
  const [formData, setFormData] = useState<ITeacher>({
    id: teacherData.id,
    name: teacherData.name || '',
    email: teacherData.email || '',
    gender: teacherData.gender || '',
    phoneNo: teacherData.phoneNo || 0,
    empId: teacherData.empId || '',
    assignedClass: teacherData.assignedClass || '',
    specialization: teacherData.specialization || '',
    dateOfBirth: teacherData.dateOfBirth || '',
    age: teacherData.age || 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      id: teacherData.id,
      name: teacherData.name || '',
      email: teacherData.email || '',
      gender: teacherData.gender || '',
      phoneNo: teacherData.phoneNo || 0,
      empId: teacherData.empId || '',
      assignedClass: teacherData.assignedClass || '',
      specialization: teacherData.specialization || '',
      dateOfBirth: teacherData.dateOfBirth || '',
      age: teacherData.age || 0,
    });
  }, [teacherData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const trimmedName = String(formData.name || '').trim();
    const trimmedEmail = String(formData.email || '').trim();
    if (!trimmedName) newErrors.name = 'Name is required';
    if (!trimmedEmail) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(trimmedEmail))
      newErrors.email = 'Email is invalid';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phoneNo || formData.phoneNo <= 0)
      newErrors.phoneNo = 'Valid phone number is required';
    if (!String(formData.empId || '').trim())
      newErrors.empId = 'Employee ID is required';
    if (!String(formData.assignedClass || '').trim())
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
    console.log('this is handlesubmit ');

    setIsSubmitting(true);
    try {
      const updatedTeacher = await editTeacher(teacherData.id, formData);

      if (updatedTeacher) {
        onEdit(updatedTeacher);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update teacher:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 text-black shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h3 className="text-xl font-semibold">Edit Teacher</h3>
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
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full rounded-md border bg-white p-2 text-black"
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
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="number"
              name="phoneNo"
              value={formData.phoneNo || ''}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.phoneNo && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Employee ID</label>
            <input
              type="text"
              name="empId"
              value={formData.empId || ''}
              onChange={handleChange}
              placeholder="Employee ID"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.empId && (
              <p className="mt-1 text-xs text-red-500">{errors.empId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Assigned Class</label>
            <input
              type="text"
              name="assignedClass"
              value={formData.assignedClass || ''}
              onChange={handleChange}
              placeholder="Assigned Class"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.assignedClass && (
              <p className="mt-1 text-xs text-red-500">
                {errors.assignedClass}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className="w-full rounded-md border bg-white p-2 text-black"
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleChange}
              placeholder="Specialization"
              className="w-full rounded-md border bg-white p-2 text-black placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-2 mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditTeacherModal;
