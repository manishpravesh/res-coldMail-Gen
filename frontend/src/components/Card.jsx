import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Card = ({
  children,
  className = "",
  hover = false,
  gradient = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          : {}
      }
      className={clsx(
        "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = "" }) => (
  <div className={clsx("px-6 py-4 border-b border-gray-200", className)}>
    {children}
  </div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={clsx("px-6 py-4", className)}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div
    className={clsx("px-6 py-4 border-t border-gray-200 bg-gray-50", className)}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
