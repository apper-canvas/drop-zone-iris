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

const UploadHistory = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await uploadService.getUploadHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || "Failed to load upload history");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (fileId) => {
    try {
      await uploadService.removeFile(fileId);
      setHistory(prev => prev.filter(f => f.Id !== fileId));
      toast.success("File removed from history");
    } catch (err) {
      toast.error("Failed to remove file from history");
    }
  };

  const handleClearHistory = async () => {
    try {
      await uploadService.clearHistory();
      setHistory(prev => prev.filter(f => f.status !== "completed"));
      toast.success("Upload history cleared");
    } catch (err) {
      toast.error("Failed to clear history");
    }
  };

  const filteredHistory = history.filter(file => {
    if (filter === "all") return true;
    return file.status === filter;
  });

  const filterOptions = [
    { value: "all", label: "All Files", icon: "Files" },
    { value: "completed", label: "Completed", icon: "CheckCircle" },
    { value: "failed", label: "Failed", icon: "XCircle" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[90vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <ApperIcon name="History" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Upload History</h2>
                    <p className="text-sm text-gray-600">View your recent file uploads</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <ApperIcon name={option.icon} className="w-4 h-4" />
                    <span>{option.label}</span>
                    <span className="bg-white/80 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {option.value === "all" ? history.length : history.filter(f => f.status === option.value).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {loading && <Loading />}
              {error && <Error message={error} onRetry={loadHistory} />}

              {!loading && !error && filteredHistory.length === 0 && (
                <Empty 
                  title="No files found"
                  message={filter === "all" ? "No files in your upload history yet" : `No ${filter} files found`}
                  showAction={false}
                />
              )}

              {!loading && !error && filteredHistory.length > 0 && (
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredHistory.map((file) => (
                      <FileCard
                        key={file.Id}
                        file={file}
                        onRemove={handleRemoveFromHistory}
                        showRetry={false}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadHistory;