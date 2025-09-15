import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const UploadStats = ({ 
  totalFiles = 0, 
  completedFiles = 0, 
  failedFiles = 0,
  uploadingFiles = 0,
  totalSize = 0 
}) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: "Files",
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      label: "Completed",
      value: completedFiles,
      icon: "CheckCircle",
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      label: "Failed",
      value: failedFiles,
      icon: "XCircle",
      color: "text-red-600",
      bgColor: "from-red-50 to-red-100"
    },
    {
      label: "Uploading",
      value: uploadingFiles,
      icon: "Upload",
      color: "text-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <ApperIcon 
                name={stat.icon} 
                className={`w-6 h-6 ${stat.color}`}
              />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      
      {totalSize > 0 && (
        <motion.div
          className="pt-4 border-t border-gray-100 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-gray-600">
            Total Size: <span className="font-semibold text-gray-900">{formatSize(totalSize)}</span>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default UploadStats;