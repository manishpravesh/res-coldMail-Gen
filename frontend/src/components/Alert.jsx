import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: XCircle,
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "rounded-lg border p-4",
        config.bg,
        config.border,
        className,
      )}
    >
      <div className="flex items-start">
        <Icon className={clsx("w-5 h-5 mt-0.5", config.iconColor)} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx("text-sm font-medium", config.textColor)}>
              {title}
            </h3>
          )}
          {message && (
            <p className={clsx("text-sm", title && "mt-1", config.textColor)}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx(
              "ml-3",
              config.iconColor,
              "hover:opacity-75 transition-opacity",
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;
