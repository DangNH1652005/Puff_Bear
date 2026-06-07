import React from "react";

const Loading = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-screen" : "h-full w-full"
      }`}
    >
      <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
