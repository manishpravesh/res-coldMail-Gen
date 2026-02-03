import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "indigo",
}) => {
  const colors = {
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    purple: "from-purple-500 to-pink-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {trendValue && (
              <div className="mt-2 flex items-center text-sm">
                <span
                  className={clsx(
                    "font-medium",
                    trend === "up" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {trend === "up" ? "↑" : "↓"} {trendValue}
                </span>
                <span className="ml-2 text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`bg-gradient-to-br ${colors[color]} p-3 rounded-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${colors[color]}`} />
    </motion.div>
  );
};

export default StatCard;
