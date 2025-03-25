import React from 'react';

type Class = {
  _id: string;
  name: string;
};

type ClassSelectorProps = {
  classes: Class[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
};

const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="classSelector"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Select Class
      </label>
      <select
        id="classSelector"
        value={selectedClassId}
        onChange={(e) => onSelectClass(e.target.value)}
        className="mx-auto block w-full max-w-xs rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-blue-500"
      >
        {classes.length === 0 ? (
          <option value="">No classes available</option>
        ) : (
          classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ClassSelector;
