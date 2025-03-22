import React from "react";

const Spinner = () => {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  );
};

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
