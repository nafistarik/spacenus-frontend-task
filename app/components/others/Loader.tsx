import React from 'react';

const Loading = () => (
  <div className="flex flex-col justify-center items-center w-full h-60 space-y-6">
      <div className="w-16 h-16 border-8 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>

      <p className="text-gray-600 text-2xl font-semibold animate-pulse">
        Loading...
      </p>
    </div>
);

export default Loading;