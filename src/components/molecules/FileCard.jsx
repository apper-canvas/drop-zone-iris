import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import Card from "@/components/atoms/Card";
import { formatFileSize, getFileIcon } from "@/utils/fileUtils";

const FileCard = ({ 
  file, 
  onRemove, 
  onRetry, 
  showRemove = true,
  showRetry = true,
  compact = false 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "failed": return "text-red-600";
      case "uploading": return "text-blue-600";
      default: return "text-gray-600";
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "failed": return "XCircle";
      case "uploading": return "Loader";
      default: return "Clock";
    }
  };

  const getProgressVariant = (status) => {
    switch (status) {
      case "completed": return "success";
      case "failed": return "danger";
      case "uploading": return "primary";
      default: return "primary";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card hover className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                className="w-5 h-5 text-blue-600"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={getStatusIcon(file.status)}
                  className={`w-4 h-4 ${getStatusColor(file.status)} ${
                    file.status === "uploading" ? "animate-spin" : ""
                  }`}
                />
                {showRetry && file.status === "failed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRetry?.(file.Id)}
                    className="p-1 h-6 w-6"
                  >
                    <ApperIcon name="RotateCcw" className="w-3 h-3" />
                  </Button>
                )}
                {showRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove?.(file.Id)}
                    className="p-1 h-6 w-6 text-gray-400 hover:text-red-600"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{formatFileSize(file.size)}</span>
              {file.uploadedAt && file.status === "completed" && (
                <span>{format(new Date(file.uploadedAt), "MMM d, h:mm a")}</span>
              )}
            </div>
            
            {(file.status === "uploading" || file.progress > 0) && (
              <div className="space-y-1">
                <Progress 
                  value={file.progress} 
                  variant={getProgressVariant(file.status)}
                  size="sm"
                  showValue
                />
              </div>
            )}
            
            {file.error && (
              <motion.p 
                className="text-xs text-red-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {file.error}
              </motion.p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FileCard;