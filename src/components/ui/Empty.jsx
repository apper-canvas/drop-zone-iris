import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No files uploaded yet", 
  message = "Drop files here or click to browse and start uploading",
  onAction,
  actionText = "Browse Files",
  showAction = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ApperIcon 
          name="Upload" 
          className="w-12 h-12 text-blue-500"
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 text-center max-w-md mb-8">
        {message}
      </p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          className="px-8"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;