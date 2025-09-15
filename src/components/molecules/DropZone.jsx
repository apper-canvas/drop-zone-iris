import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DropZone = ({ 
  onFilesSelected, 
  maxFiles = 10,
  accept = "*/*",
  disabled = false,
  className 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setIsDragActive(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setIsDragOver(false);
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
    if (files.length > 0) {
      onFilesSelected?.(files);
    }
  };
  
  const handleFileSelect = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, maxFiles);
    if (files.length > 0) {
      onFilesSelected?.(files);
    }
    // Reset input value so same file can be selected again
    e.target.value = "";
  };
  
  return (
    <motion.div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
        isDragActive 
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 scale-[1.02]"
          : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileSelect}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            isDragActive 
              ? "bg-gradient-to-br from-blue-200 to-blue-300" 
              : "bg-gradient-to-br from-gray-200 to-gray-300"
          )}
          animate={{
            scale: isDragActive ? 1.1 : 1,
            rotate: isDragActive ? 5 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon 
            name={isDragActive ? "DownloadCloud" : "Upload"} 
            className={cn(
              "w-8 h-8",
              isDragActive ? "text-blue-600" : "text-gray-600"
            )}
          />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isDragActive ? "Drop files here" : "Upload Files"}
          </h3>
          <p className="text-sm text-gray-600">
            {isDragActive 
              ? "Release to upload your files"
              : "Drag and drop files here, or click to browse"
            }
          </p>
          <p className="text-xs text-gray-500">
            Maximum {maxFiles} files at once
          </p>
        </div>
        
        {!isDragActive && (
          <Button
            variant="primary"
            size="lg"
            className="mt-4"
            disabled={disabled}
          >
            <ApperIcon name="FolderOpen" className="w-5 h-5 mr-2" />
            Browse Files
          </Button>
        )}
      </div>
      
      {isDragActive && (
        <motion.div
          className="absolute inset-0 bg-blue-500/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default DropZone;