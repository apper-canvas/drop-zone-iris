import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Progress = ({ 
  value = 0, 
  max = 100,
  variant = "primary",
  size = "md",
  showValue = false,
  className,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    primary: "from-blue-500 to-blue-600",
    success: "from-green-500 to-green-600", 
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600"
  };
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cn("bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          className={cn("h-full bg-gradient-to-r rounded-full", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      {showValue && (
        <motion.div 
          className="text-xs text-gray-600 mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
};

export default Progress;