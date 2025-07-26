import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-solid border-blue-200"></div>
    </div>
  );
};

export default LoadingSpinner;
