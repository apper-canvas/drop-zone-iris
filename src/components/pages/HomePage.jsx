import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import DropZone from "@/components/molecules/DropZone";
import FileUploadQueue from "@/components/organisms/FileUploadQueue";
import UploadSettings from "@/components/organisms/UploadSettings";
import UploadHistory from "@/components/organisms/UploadHistory";
import { uploadService } from "@/services/api/uploadService";
import { validateFile } from "@/utils/fileUtils";
import { toast } from "react-toastify";

const HomePage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await uploadService.getUploadSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleFilesSelected = (files) => {
    if (!settings) return;

    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      const validation = validateFile(file, settings);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.errors.join(", ")}`);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      toast.success(`${validFiles.length} file(s) added to upload queue`);
    }
  };

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        onHistoryClick={() => setShowHistory(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Drop Zone
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Upload files quickly and reliably with clear progress feedback. 
              Drag and drop or click to browse your files.
            </motion.p>
          </div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <DropZone
              onFilesSelected={handleFilesSelected}
              maxFiles={settings?.maxConcurrentUploads || 5}
              className="max-w-4xl mx-auto"
            />
          </motion.div>

          {/* Upload Queue */}
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FileUploadQueue 
              newFiles={selectedFiles}
              onFilesChange={handleFilesChange}
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Modals */}
      <UploadSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <UploadHistory 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default HomePage;