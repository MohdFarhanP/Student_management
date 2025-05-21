import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../assets/hand-drawn-study-abroad-illustration.png';

const InternalServerError: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-4xl flex-col items-center rounded-lg shadow-lg md:flex-row">
        {/* Image Section */}
        <div className="flex w-full items-center justify-center p-6 md:w-1/2">
          <img
            src={bannerImg}
            alt="500 Illustration"
            className="h-64 w-64 object-contain sm:h-80 sm:w-80"
          />
        </div>

        {/* Text and Button Section */}
        <div className="flex w-full flex-col justify-center p-6 text-center md:w-1/2 md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">
            500 - Internal Server Error
          </h1>
          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            Something went wrong on our end. Please try again later or contact support.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-gray-800 px-6 py-3 text-white transition hover:bg-black sm:px-8 sm:py-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternalServerError;