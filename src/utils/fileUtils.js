export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

export const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type.startsWith("audio/")) return "Music";
  if (type.includes("pdf")) return "FileText";
  if (type.includes("document") || type.includes("word")) return "FileText";
  if (type.includes("spreadsheet") || type.includes("excel")) return "Sheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Archive";
  return "File";
};

export const validateFile = (file, settings) => {
  const errors = [];
  
  if (file.size > settings.maxFileSize) {
    errors.push(`File size exceeds ${formatFileSize(settings.maxFileSize)} limit`);
  }
  
  if (settings.allowedTypes.length > 0 && !settings.allowedTypes.some(type => file.type.includes(type))) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};