import { useEffect, useState } from 'react';
import { IStudent } from '../pages/admin/Student';
import { editStudents } from '../api/adminApi';

interface EditStudentModalProps {
  studentData: IStudent;
  onClose: () => void;

}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  studentData,
  onClose,

}) => {
  const [formData, setFormData] = useState<IStudent>(() => ({
    id:studentData.id,
    name: studentData.name || '',
    email: studentData.email || '',
    age: studentData.age || 0,
    gender: studentData.gender || '',
    roleNumber: studentData.roleNumber || '',
    class: studentData.class || '',
    subjectIds: studentData.subjectIds || [],
    address: {
      phoneNo: studentData.address?.phoneNo || '',
      guardianName: studentData.address?.guardianName || '',
      houseName: studentData.address?.houseName || '',
      place: studentData.address?.place || '',
      district: studentData.address?.district || '',
      pincode: studentData.address?.pincode || '',
    },
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData({
      id:studentData.id,
      name: studentData.name || '',
      email: studentData.email || '',
      age: studentData.age || 0,
      gender: studentData.gender || '',
      roleNumber: studentData.roleNumber || '',
      class: studentData.class || '',
      subjectIds: studentData.subjectIds || [],
      address: {
        phoneNo: studentData.address?.phoneNo || '',
        guardianName: studentData.address?.guardianName || '',
        houseName: studentData.address?.houseName || '',
        place: studentData.address?.place || '',
        district: studentData.address?.district || '',
        pincode: studentData.address?.pincode || '',
      },
    });
  }, [studentData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};


    // String fields with trim
    if (!String(formData.name || '').trim()) newErrors.name = 'Name is required';
    if (!String(formData.email || '').trim()) newErrors.email = 'Email is required';
    if (!formData.age || formData.age <= 0) newErrors.age = 'Valid age is required'; 
    if (!String(formData.gender || '').trim()) newErrors.gender = 'Gender is required';
    if (!String(formData.roleNumber || '').trim()) newErrors.roleNumber = 'Role Number is required';
    if (!String(formData.address?.phoneNo || '').trim()) newErrors.phoneNo = 'Phone Number is required';
    if (!String(formData.address?.guardianName || '').trim()) newErrors.guardianName = 'Guardian Name is required';
    if (!String(formData.address?.houseName || '').trim()) newErrors.houseName = 'House Name is required';
    if (!String(formData.address?.place || '').trim()) newErrors.place = 'Place is required';
    if (!String(formData.address?.district || '').trim()) newErrors.district = 'District is required';
    if (!String(formData.address?.pincode || '').trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const errorKey = name.startsWith('address.') ? name.split('.')[1] : name;

    if (name === 'age') {
      setFormData((prevData) => ({ ...prevData, age: value ? parseInt(value) : 0 }));
    } else if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [key]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: '' }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      subjectIds: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
  
    if (!isValid) {
      console.log('Validation failed, errors:', errors);
      return;
    }
  
    try {
      const updatedTeacher = await editStudents(studentData.id, formData);
      if (updatedTeacher) {
        console.log('Teacher updated successfully:', updatedTeacher);
        onClose(); 
      }
    } catch (error) {
      console.log('Failed to update teacher:', error);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-5 text-black shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-lg font-semibold text-gray-800">Edit Student</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors duration-150"
          >
            ✕
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
              min="1"
            />
            {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Number</label>
            <input
              type="text"
              name="roleNumber"
              value={formData.roleNumber}
              onChange={handleChange}
              placeholder="Role Number"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.roleNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.roleNumber}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            >
              <option value="">Select Class</option>
              {/* {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))} */}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
            <select
              name="subjectIds"
              multiple
              size={3}
              value={formData.subjectIds}
              onChange={handleSubjectChange}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            >
              {/* {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))} */}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">House Name</label>
            <input
              type="text"
              name="address.houseName"
              value={formData.address?.houseName || ''}
              onChange={handleChange}
              placeholder="House Name"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.houseName && (
              <p className="mt-1 text-xs text-red-500">{errors.houseName}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
            <input
              type="text"
              name="address.place"
              value={formData.address?.place || ''}
              onChange={handleChange}
              placeholder="Place"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.place && <p className="mt-1 text-xs text-red-500">{errors.place}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              name="address.district"
              value={formData.address?.district || ''}
              onChange={handleChange}
              placeholder="District"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.district && (
              <p className="mt-1 text-xs text-red-500">{errors.district}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              name="address.pincode"
              value={formData.address?.pincode || ''}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
            <input
              type="text"
              name="address.guardianName"
              value={formData.address?.guardianName || ''}
              onChange={handleChange}
              placeholder="Guardian Name"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.guardianName && (
              <p className="mt-1 text-xs text-red-500">{errors.guardianName}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="address.phoneNo"
              value={formData.address?.phoneNo || ''}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-black focus:border-black/75 outline-none transition-colors duration-150"
            />
            {errors.phoneNo && <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>}
          </div>
  
          <div className="col-span-2 mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black/95 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;