import { useEffect, useState } from 'react';
import { getClassNames } from '../api/adminApi';

interface ClassDropdownProps {
  onSelectClass: (className: string) => void;
}
interface ClassType {
  id: string;
  grade: string;
}

const ClassDropdown = ({ onSelectClass }: ClassDropdownProps) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassType[] | []>([]);

  useEffect(() => {
    async function fetch() {
      const classes = await getClassNames();
      console.log('this is the class form ClassDropdown', classes);
      setClasses(classes);
    }
    fetch();
  }, []);

  const handleSelect = (className: string) => {
    setSelectedClass(className);
    onSelectClass(className);
  };

  return (
    <div className="relative w-64">
      <select
        className="border- rounded-lg bg-black px-4 py-2 text-white transition duration-300 outline-none hover:bg-black focus:border-black"
        value={selectedClass || ''}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option className="text-white" value="" disabled>
          Select a class
        </option>
        {classes.map(({ grade }) => (
          <option key={grade} value={grade} className="text-white">
            {grade}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassDropdown;
