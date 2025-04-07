import { useState } from 'react';
import { IStudent, addStudent } from '../api/admin/studentApi';

interface AddStudentModalProps {
  onClose: () => void;
  onAdd?: (newStudent: IStudent) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Partial<IStudent>>({
    name: '',
    email: '',
    roleNumber: '',
    dob: '',
    gender: '',
    age: 0,
    class: '',
    profileImage: '',
    address: {
      houseName: '',
      place: '',
      district: '',
      pincode: '',
      phoneNo: '',
      guardianName: '',
      guardianContact: '',
    },
  });
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
      const newStudent = await addStudent(formData);
      onAdd?.(newStudent);
      onClose();
    } catch (error) {
      console.error('Failed to add student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div className="relative w-full max-w-3xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-xl font-semibold text-black">Add Student</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-lg text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Name"
                className="mt-1 w-full rounded-md border p-2 text-black"
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
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Role Number
              </label>
              <input
                type="text"
                name="roleNumber"
                value={formData.roleNumber || ''}
                onChange={handleChange}
                placeholder="Role Number"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.roleNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.roleNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ''}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.dob && (
                <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
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
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                placeholder="Age"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-500">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={formData.class || ''}
                onChange={handleChange}
                placeholder="Class (e.g., 10B)"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Profile Image
              </label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage || ''}
                onChange={handleChange}
                placeholder="Image URL"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                House Name
              </label>
              <input
                type="text"
                name="houseName"
                value={formData.address?.houseName || ''}
                onChange={handleChange}
                placeholder="House Name"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.houseName && (
                <p className="mt-1 text-xs text-red-500">{errors.houseName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Place
              </label>
              <input
                type="text"
                name="place"
                value={formData.address?.place || ''}
                onChange={handleChange}
                placeholder="Place"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.place && (
                <p className="mt-1 text-xs text-red-500">{errors.place}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.address?.district || ''}
                onChange={handleChange}
                placeholder="District"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.district && (
                <p className="mt-1 text-xs text-red-500">{errors.district}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Pincode
              </label>
              <input
                type="number"
                name="pincode"
                value={formData.address?.pincode || ''}
                onChange={handleChange}
                placeholder="Pincode"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.pincode && (
                <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNo"
                value={formData.address?.phoneNo || ''}
                onChange={handleChange}
                placeholder="Phone Number"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.phoneNo && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.address?.guardianName || ''}
                onChange={handleChange}
                placeholder="Guardian Name"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
              {errors.guardianName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.guardianName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Guardian Contact
              </label>
              <input
                type="text"
                name="guardianContact"
                value={formData.address?.guardianContact || ''}
                onChange={handleChange}
                placeholder="Guardian Contact"
                className="mt-1 w-full rounded-md border p-2 text-black"
                disabled={isSubmitting}
              />
            </div>
            <div className="col-span-2 mt-6 flex justify-end space-x-3">
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
                {isSubmitting ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
