import React, { useEffect, useState } from 'react';
import { getClassNames } from '../api/admin/classApi';

interface ClassDropdownProps {
  onSelectClass: (className: string) => void;
}

interface ClassType {
  id: string;
  grade: string;
}

const ClassDropdown: React.FC<ClassDropdownProps> = ({ onSelectClass }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);

  useEffect(() => {
    async function fetch() {
      const classes = await getClassNames();
      console.log('Classes from ClassDropdown:', classes);
      setClasses(classes || []);
    }
    fetch();
  }, []);

  const handleSelect = (className: string) => {
    setSelectedClass(className);
    onSelectClass(className);
  };

  return (
    <div className="relative w-48 sm:w-64">
      <select
        className="select select-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring-primary"
        value={selectedClass || ''}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="" disabled>
          Select a class
        </option>
        {classes.map(({ grade }) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(ClassDropdown);