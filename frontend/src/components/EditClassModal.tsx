import { useEffect, useState } from 'react';
import { IClassData } from '../api/adminApi';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { editClass } from '../redux/slices/classSlice';

interface FormFields {
  name?: string;
  grade?: string;
  section?: string;
  roomNo?: string;
  tutor?: string;
}
const EditClassModal = ({ classData }: { classData: IClassData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<IClassData>(classData);
  const [errors, setErrors] = useState<FormFields>({
    name: '',
    grade: '',
    section: '',
    roomNo: '',
    tutor: '',
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setFormData(classData);
  }, [classData]);

  useEffect(() => {
    if (formData.grade && formData.section) {
      setFormData((prev) => ({
        ...prev,
        name: `${formData.grade}${formData.section}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: '',
      }));
    }
  }, [formData.section, formData.grade]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const ValidateForm = () => {
    const newErrors: FormFields = {};
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.roomNo) newErrors.roomNo = 'Room Number is required';
    else if (Number(formData.roomNo) < 0)
      newErrors.roomNo = 'RoomNo cannot negative';
    if (!formData.tutor) newErrors.tutor = 'Tutor is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({
      ...prevData,
      [name]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ValidateForm()) {
      await dispatch(editClass(formData));
      toggleModal();
    }
  };

  return (
    <>
      {/* Modal toggle button */}
      <button className="btn btn-black btn-sm text-white" onClick={toggleModal}>
        Edit Class
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={toggleModal} // Close on overlay click
        >
          <div
            className="relative max-h-screen w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            {/* Modal header */}
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Class
              </h3>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-gray-900"
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                      placeholder="Type class name"
                      readOnly
                      disabled
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    >
                      <option value="">Select section</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    {errors.section && (
                      <p className="text-sm text-red-500">{errors.section}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700">
                      Grade
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    >
                      <option value="">Select Grade</option>
                      {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    {errors.grade && (
                      <p className="text-sm text-red-500">{errors.grade}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700">
                      Room No
                    </label>
                    <input
                      type="number"
                      name="roomNo"
                      value={formData.roomNo}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                      placeholder="Room Number"
                      min={0}
                    />
                    {errors.roomNo && (
                      <p className="text-sm text-red-500">{errors.roomNo}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700">
                      Tutor
                    </label>
                    <select
                      name="tutor"
                      value={formData.tutor}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    >
                      <option value="">Select Tutor</option>
                      {[
                        'Ramesh',
                        'Sumesh',
                        'Gouthem',
                        'Sujatha',
                        'ManiKandan',
                        'Sujesh',
                        'Suhail',
                        'Sabida',
                      ].map((tutor) => (
                        <option key={tutor} value={tutor}>
                          {tutor}
                        </option>
                      ))}
                    </select>
                    {errors.tutor && (
                      <p className="text-sm text-red-500">{errors.tutor}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="rounded-md bg-gray-300 px-4 py-2 text-black transition hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black/90 px-4 py-2 text-white transition hover:bg-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditClassModal;
