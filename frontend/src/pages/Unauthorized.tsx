
export const Unauthorized = () => (
  <div className="flex min-h-screen items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-error mb-4 dark:text-red-400">
        403 - Unauthorized
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
        You don't have permission to view this page.
      </p>
      <a href="/" className="btn btn-primary btn-sm sm:btn-md">
        Back to Home
      </a>
    </div>
  </div>
);