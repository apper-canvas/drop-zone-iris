import uploadHistoryData from "@/services/mockData/uploadHistory.json";
import uploadSettingsData from "@/services/mockData/uploadSettings.json";

let uploadHistory = [...uploadHistoryData];
let uploadSettings = { ...uploadSettingsData };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadService = {
  async getUploadHistory() {
    await delay(300);
    return uploadHistory.map(item => ({ ...item }));
  },

  async getUploadSettings() {
    await delay(200);
    return { ...uploadSettings };
  },

  async updateUploadSettings(newSettings) {
    await delay(250);
    uploadSettings = { ...uploadSettings, ...newSettings };
    return { ...uploadSettings };
  },

  async uploadFile(file, onProgress) {
    await delay(100);
    
    const fileData = {
      Id: Math.max(...uploadHistory.map(f => f.Id || 0)) + 1,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
      error: null
    };

    uploadHistory.unshift(fileData);

    // Simulate upload progress
    const progressSteps = [10, 25, 45, 65, 80, 95, 100];
    const shouldFail = Math.random() < 0.15; // 15% chance of failure
    const failAt = Math.floor(Math.random() * 5) + 2;

    for (let i = 0; i < progressSteps.length; i++) {
      await delay(200 + Math.random() * 300);
      
      if (shouldFail && i === failAt) {
        fileData.status = "failed";
        fileData.error = "Upload failed due to network error";
        fileData.progress = progressSteps[i - 1] || 0;
        break;
      }
      
      fileData.progress = progressSteps[i];
      onProgress?.(progressSteps[i]);
      
      if (progressSteps[i] === 100) {
        fileData.status = "completed";
        fileData.uploadedAt = new Date().toISOString();
      }
    }

    return { ...fileData };
  },

  async retryUpload(fileId, onProgress) {
    await delay(150);
    
    const fileIndex = uploadHistory.findIndex(f => f.Id === fileId);
    if (fileIndex === -1) {
      throw new Error("File not found");
    }

    const fileData = uploadHistory[fileIndex];
    fileData.status = "uploading";
    fileData.progress = 0;
    fileData.error = null;

    // Simulate retry with higher success rate
    const progressSteps = [15, 35, 55, 75, 90, 100];
    const shouldFail = Math.random() < 0.05; // 5% chance of failure on retry

    for (let i = 0; i < progressSteps.length; i++) {
      await delay(180 + Math.random() * 200);
      
      if (shouldFail && i === 3) {
        fileData.status = "failed";
        fileData.error = "Retry failed - please check your connection";
        fileData.progress = progressSteps[i - 1] || 0;
        break;
      }
      
      fileData.progress = progressSteps[i];
      onProgress?.(progressSteps[i]);
      
      if (progressSteps[i] === 100) {
        fileData.status = "completed";
        fileData.uploadedAt = new Date().toISOString();
      }
    }

    return { ...fileData };
  },

  async removeFile(fileId) {
    await delay(200);
    const index = uploadHistory.findIndex(f => f.Id === fileId);
    if (index !== -1) {
      const removed = uploadHistory.splice(index, 1)[0];
      return { ...removed };
    }
    throw new Error("File not found");
  },

  async clearHistory() {
    await delay(300);
    const completed = uploadHistory.filter(f => f.status === "completed");
    uploadHistory = uploadHistory.filter(f => f.status !== "completed");
    return completed;
  }
};