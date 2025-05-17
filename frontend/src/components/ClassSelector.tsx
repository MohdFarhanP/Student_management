import React, { memo } from 'react';

type Class = {
  _id?: string;
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
    <div className="relative w-48 sm:w-64">
      <select
        id="classSelector"
        value={selectedClassId}
        onChange={(e) => onSelectClass(e.target.value)}
        className="select select-bordered w-full text-base-content dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring-primary"
      >
        {classes.length === 0 ? (
          <option value="" disabled>
            No classes available
          </option>
        ) : (
          <>
            <option value="" disabled>
              Select a class
            </option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default memo(ClassSelector);