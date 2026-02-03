import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", color = "indigo" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colors = {
    indigo: "border-indigo-600",
    white: "border-white",
    gray: "border-gray-600",
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-8 shadow-2xl">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-700 font-medium text-center">{message}</p>
      )}
    </div>
  </div>
);

export default LoadingSpinner;
