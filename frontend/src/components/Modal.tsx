import { useEffect, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { createClass } from '../redux/slices/classSlice';
import { fetchTeachers } from '../redux/slices/classSlice';
import { IClassData } from '../api/admin/classApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';

interface FormFields {
  name?: string;
  grade?: string;
  section?: string;
  roomNo?: string;
  tutor?: string;
}

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<IClassData>({
    name: '',
    grade: '',
    section: '',
    roomNo: '',
    tutor: '',
  });
  const [errors, setErrors] = useState<FormFields>({
    name: '',
    grade: '',
    section: '',
    roomNo: '',
    tutor: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const teachers = useSelector((state: RootState) => state.classes.teachers);
  const teacherStatus = useSelector((state: RootState) => state.classes.teacherStatus);

  useEffect(() => {
    if (teacherStatus === 'idle') {
      dispatch(fetchTeachers());
    }
  }, [dispatch, teacherStatus]);

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

  const validateForm = () => {
    const newErrors: FormFields = {};
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.roomNo) newErrors.roomNo = 'Room Number is required';
    else if (Number(formData.roomNo) < 0)
      newErrors.roomNo = 'Room Number cannot be negative';
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
    if (validateForm()) {
      await dispatch(createClass(formData));
      setFormData({
        name: '',
        grade: '',
        section: '',
        roomNo: '',
        tutor: '',
      });
      toggleModal();
    }
  };

  return (
    <>
      {/* Modal toggle button */}
      <button
        className="btn btn-primary btn-sm sm:btn-md flex items-center gap-2"
        onClick={toggleModal}
      >
        Add Class <CiCirclePlus className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md bg-base-100 dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-base-content dark:text-white">
                Create New Class
              </h3>
              <button
                onClick={toggleModal}
                className="btn btn-sm btn-circle btn-ghost text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                    Class Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Class Name (e.g., 1A)"
                    readOnly
                    disabled
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-error">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select Grade</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-1 text-xs text-error">{errors.grade}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select Section</option>
                    {['A', 'B', 'C', 'D', 'E'].map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                  {errors.section && (
                    <p className="mt-1 text-xs text-error">{errors.section}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                    Room No
                  </label>
                  <input
                    type="number"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleChange}
                    className="input input-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Room Number"
                    min={0}
                  />
                  {errors.roomNo && (
                    <p className="mt-1 text-xs text-error">{errors.roomNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content dark:text-gray-300">
                    Tutor
                  </label>
                  <select
                    name="tutor"
                    value={formData.tutor}
                    onChange={handleChange}
                    className="select select-bordered w-full mt-1 text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select Tutor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  {errors.tutor && (
                    <p className="mt-1 text-xs text-error">{errors.tutor}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="btn btn-outline btn-sm sm:btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm sm:btn-md"
                  >
                    Add New Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;