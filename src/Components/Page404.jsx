import React from 'react';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex justify-center items-center flex-col gap-6 px-4 py-12'>
      <div className='relative'>
        {/* Animated 404 text */}
        <div className='text-8xl md:text-9xl font-bold text-gray-300 dark:text-gray-700 opacity-90 text-center'>
          404
        </div>

        {/* Overlay text */}
        <div className='inset-0 flex items-center justify-center'>
          <div className='text-2xl md:text-4xl font-bold text-gray-700 dark:text-white mt-4'>
            Page Not Found :
          </div>
        </div>
      </div>

      <div className='max-w-md text-center space-y-4'>
        <p className='text-lg text-gray-600 dark:text-gray-300'>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link 
        to='/' 
        className='
          mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg
          font-medium shadow-md hover:bg-indigo-700 
          transition-all duration-300 hover:shadow-lg
          transform hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        '
      >
        Return to Home
      </Link>

      <div className='mt-8 text-sm text-gray-400 dark:text-gray-500'>
        Need help? <a href='mailto:support@example.com' className='text-indigo-500 hover:underline'>Contact support</a>
      </div>
    </div>
  );
};

export default Page404;
