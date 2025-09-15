import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FileCard from "@/components/molecules/FileCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { uploadService } from "@/services/api/uploadService";
import { generateFileId } from "@/utils/fileUtils";

const FileUploadQueue = ({ newFiles = [], onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle new files added to queue
  useEffect(() => {
    if (newFiles.length > 0) {
      const filesWithIds = newFiles.map(file => ({
        Id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
progress: 0,
        uploadedAt: null,
        description: null,
        error: null,
        file: file // Keep reference to actual File object
      }));
      
      setFiles(prev => [...filesWithIds, ...prev]);
      
      // Start uploading the new files
      filesWithIds.forEach(fileData => {
        uploadFile(fileData);
      });
      
      onFilesChange?.([]);
    }
  }, [newFiles]);

  const uploadFile = async (fileData) => {
    try {
      setFiles(prev => prev.map(f => 
        f.Id === fileData.Id 
          ? { ...f, status: "uploading", progress: 0, error: null }
          : f
      ));

      await uploadService.uploadFile(fileData.file, (progress) => {
        setFiles(prev => prev.map(f => 
          f.Id === fileData.Id 
            ? { ...f, progress }
            : f
        ));
      });

setFiles(prev => prev.map(f => 
        f.Id === fileData.Id 
          ? { ...f, status: "completed", progress: 100, uploadedAt: new Date().toISOString(), description: fileData.description }
          : f
      ));

      toast.success(`${fileData.name} uploaded successfully!`);
    } catch (err) {
      setFiles(prev => prev.map(f => 
        f.Id === fileData.Id 
          ? { ...f, status: "failed", error: err.message || "Upload failed" }
          : f
      ));
      
      toast.error(`Failed to upload ${fileData.name}`);
    }
  };

  const handleRetry = async (fileId) => {
    const fileData = files.find(f => f.Id === fileId);
    if (!fileData) return;

    try {
      setFiles(prev => prev.map(f => 
        f.Id === fileId 
          ? { ...f, status: "uploading", progress: 0, error: null }
          : f
      ));

      await uploadService.retryUpload(fileId, (progress) => {
        setFiles(prev => prev.map(f => 
          f.Id === fileId 
            ? { ...f, progress }
            : f
        ));
      });

      setFiles(prev => prev.map(f => 
f.Id === fileId 
          ? { ...f, status: "completed", progress: 100, uploadedAt: new Date().toISOString(), description: null }
          : f
      ));

      toast.success(`${fileData.name} uploaded successfully!`);
    } catch (err) {
      setFiles(prev => prev.map(f => 
        f.Id === fileId 
          ? { ...f, status: "failed", error: err.message || "Upload failed" }
          : f
      ));
      
      toast.error(`Retry failed for ${fileData.name}`);
    }
  };

  const handleRemove = (fileId) => {
    setFiles(prev => prev.filter(f => f.Id !== fileId));
    toast.info("File removed from queue");
  };

  const handleClearCompleted = () => {
    const completedCount = files.filter(f => f.status === "completed").length;
    setFiles(prev => prev.filter(f => f.status !== "completed"));
    toast.success(`Cleared ${completedCount} completed files`);
  };

  const handleClearAll = () => {
    setFiles([]);
    toast.info("Upload queue cleared");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  const completedFiles = files.filter(f => f.status === "completed");
  const failedFiles = files.filter(f => f.status === "failed");
  const uploadingFiles = files.filter(f => f.status === "uploading");

  if (files.length === 0) {
    return (
      <Empty 
        title="No files in queue"
        message="Files you select for upload will appear here with their progress"
        showAction={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Queue</h3>
          <div className="flex items-center space-x-2">
            {completedFiles.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearCompleted}
              >
                <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                Clear Completed ({completedFiles.length})
              </Button>
            )}
            {files.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{files.length}</div>
            <div className="text-xs text-blue-700">Total</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedFiles.length}</div>
            <div className="text-xs text-green-700">Completed</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{uploadingFiles.length}</div>
            <div className="text-xs text-orange-700">Uploading</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedFiles.length}</div>
            <div className="text-xs text-red-700">Failed</div>
          </div>
        </div>
      </Card>

      {/* File List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <FileCard
              key={file.Id}
              file={file}
              onRemove={handleRemove}
              onRetry={handleRetry}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUploadQueue;