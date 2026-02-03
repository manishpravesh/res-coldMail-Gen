import React from "react";
import clsx from "clsx";

const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  wrapperClassName = "",
  ...props
}) => {
  return (
    <div className={clsx("w-full", wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={clsx(
            "block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200",
            "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            Icon && "pl-10",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  className = "",
  wrapperClassName = "",
  rows = 4,
  ...props
}) => {
  return (
    <div className={clsx("w-full", wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={clsx(
          "block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          error && "border-red-300 focus:ring-red-500 focus:border-red-500",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  className = "",
  wrapperClassName = "",
  ...props
}) => {
  return (
    <div className={clsx("w-full", wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={clsx(
          "block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          error && "border-red-300 focus:ring-red-500 focus:border-red-500",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
