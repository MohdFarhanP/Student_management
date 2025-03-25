import React from 'react';

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mt-4 rounded-md bg-red-100 p-4 text-center text-red-700">
      {message}
    </div>
  );
};

export default ErrorMessage;
