import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { uploadService } from "@/services/api/uploadService";
import { formatFileSize } from "@/utils/fileUtils";

const UploadSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await uploadService.getUploadSettings();
      setSettings(data);
      setFormData({
        maxFileSize: data.maxFileSize,
        maxConcurrentUploads: data.maxConcurrentUploads,
        allowedTypes: data.allowedTypes.join(", "),
        autoRetry: data.autoRetry,
        showThumbnails: data.showThumbnails
      });
    } catch (err) {
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updatedSettings = {
        ...settings,
        maxFileSize: parseInt(formData.maxFileSize),
        maxConcurrentUploads: parseInt(formData.maxConcurrentUploads),
        allowedTypes: formData.allowedTypes ? formData.allowedTypes.split(",").map(type => type.trim()).filter(Boolean) : [],
        autoRetry: formData.autoRetry,
        showThumbnails: formData.showThumbnails
      };
      
      await uploadService.updateUploadSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success("Settings saved successfully!");
      onClose?.();
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          className="w-full max-w-2xl max-h-[90vh] overflow-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Settings" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Upload Settings</h2>
                  <p className="text-sm text-gray-600">Configure your upload preferences</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {loading && <Loading />}
            {error && <Error message={error} onRetry={loadSettings} />}

            {settings && (
              <div className="space-y-6">
                {/* File Size Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Maximum File Size
                  </label>
                  <div className="space-y-2">
                    <select
                      value={formData.maxFileSize}
                      onChange={(e) => handleInputChange("maxFileSize", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1048576}>1 MB</option>
                      <option value={5242880}>5 MB</option>
                      <option value={10485760}>10 MB</option>
                      <option value={26214400}>25 MB</option>
                      <option value={52428800}>50 MB</option>
                      <option value={104857600}>100 MB</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Current: {formatFileSize(formData.maxFileSize)}
                    </p>
                  </div>
                </div>

                {/* Concurrent Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Max Concurrent Uploads
                  </label>
                  <select
                    value={formData.maxConcurrentUploads}
                    onChange={(e) => handleInputChange("maxConcurrentUploads", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 file at a time</option>
                    <option value={2}>2 files at a time</option>
                    <option value={3}>3 files at a time</option>
                    <option value={5}>5 files at a time</option>
                  </select>
                </div>

                {/* Allowed File Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    value={formData.allowedTypes}
                    onChange={(e) => handleInputChange("allowedTypes", e.target.value)}
                    placeholder="image, pdf, document (leave empty to allow all types)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple types with commas. Leave empty to allow all file types.
                  </p>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Auto Retry Failed Uploads</label>
                      <p className="text-xs text-gray-500">Automatically retry failed uploads</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("autoRetry", !formData.autoRetry)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.autoRetry ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.autoRetry ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Show File Thumbnails</label>
                      <p className="text-xs text-gray-500">Display thumbnails for image files</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("showThumbnails", !formData.showThumbnails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.showThumbnails ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.showThumbnails ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving && <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />}
                    Save Settings
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadSettings;