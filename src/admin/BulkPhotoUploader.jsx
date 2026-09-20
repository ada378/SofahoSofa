import { useState, useRef } from "react";
import api from "../api/axios";

export default function BulkPhotoUploader({ onClose, onComplete }) {
  const [folderPath, setFolderPath] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const folderInputRef = useRef(null);
  const [uploadMethod, setUploadMethod] = useState("path"); // "path" or "folder"

  const handleStartUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!folderPath.trim() && uploadMethod === "path") {
      setError("Please enter folder path");
      return;
    }

    try {
      setUploading(true);
      const response = await api.post("/bulk-upload/process-folder", {
        folderPath: folderPath.trim(),
      });

      setSessionId(response.data.sessionId);
      
      // Start polling for progress
      const interval = setInterval(async () => {
        try {
          const result = await api.get(`/bulk-upload/progress/${response.data.sessionId}`);
          setProgress(result.data);

          if (result.data.status === "completed" || result.data.status === "error") {
            clearInterval(interval);
            setUploading(false);
          }
        } catch (err) {
          clearInterval(interval);
          setError("Failed to get progress");
        }
      }, 1000);

      // Stop polling after 30 minutes
      setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUploading(false);
    }
  };

  const handleFolderSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setError("No files selected");
      return;
    }

    // Get folder path from first file
    const firstFilePath = files[0].webkitRelativePath || files[0].name;
    const folderName = firstFilePath.split("/")[0];
    
    console.log(`Selected ${files.length} files from folder: ${folderName}`);
    
    // For now, just show feedback
    setError("");
    
    // Create FormData with all files
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("folderName", folderName);

    try {
      setUploading(true);
      
      // Upload files directly
      const response = await api.post("/bulk-upload/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSessionId(response.data.sessionId);
      
      // Start polling for progress
      const interval = setInterval(async () => {
        try {
          const result = await api.get(`/bulk-upload/progress/${response.data.sessionId}`);
          setProgress(result.data);

          if (result.data.status === "completed" || result.data.status === "error") {
            clearInterval(interval);
            setUploading(false);
          }
        } catch (err) {
          clearInterval(interval);
          setError("Failed to get progress");
        }
      }, 1000);

      setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. " + err.message);
      setUploading(false);
    }
  };

  const handleDownloadJSON = async () => {
    if (!sessionId) return;

    try {
      const response = await api.get(`/bulk-upload/json/${sessionId}`);
      const jsonString = JSON.stringify(response.data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bulk-products-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download JSON");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h3 className="font-bold text-lg text-white">📸 Bulk Photo Upload to Cloudinary</h3>
            <p className="text-xs text-gray-400">Upload photos from a folder and auto-generate products</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-lg">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 text-xs p-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {!progress ? (
          <form onSubmit={handleStartUpload} className="space-y-4">
            {/* Upload Method Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
              <button
                type="button"
                onClick={() => { setUploadMethod("folder"); setError(""); }}
                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                  uploadMethod === "folder"
                    ? "border-[#C86A3B] text-[#C86A3B]"
                    : "border-transparent text-gray-500 hover:text-gray-400"
                }`}
              >
                📁 Upload Folder
              </button>
              <button
                type="button"
                onClick={() => { setUploadMethod("path"); setError(""); }}
                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                  uploadMethod === "path"
                    ? "border-[#C86A3B] text-[#C86A3B]"
                    : "border-transparent text-gray-500 hover:text-gray-400"
                }`}
              >
                📝 Paste Path
              </button>
            </div>

            {/* Upload Folder Method */}
            {uploadMethod === "folder" && (
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">📁 Select Folder</label>
                <div className="relative">
                  <input
                    ref={folderInputRef}
                    type="file"
                    webkitdirectory="true"
                    mozdirectory="true"
                    directory="true"
                    onChange={handleFolderSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-3 text-xs font-bold bg-green-900/40 hover:bg-green-900/60 border border-green-700 text-green-300 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>📂</span>
                    Click to Select Folder with Images
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  All image files (jpg, png, webp) in the folder will be uploaded
                </p>
              </div>
            )}

            {/* Paste Path Method */}
            {uploadMethod === "path" && (
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">📝 Folder Path</label>
                <input
                  type="text"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  placeholder="Example: C:\Users\dell\OneDrive\Desktop\edit sofa"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs font-mono text-gray-100 focus:outline-none focus:border-[#C86A3B]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  All images in this folder will be processed
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || (uploadMethod === "path" && !folderPath.trim())}
              className="w-full px-6 py-3 text-xs font-bold bg-[#C86A3B] hover:bg-[#b85e32] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Start Upload
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Status:</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    progress.status === "processing"
                      ? "bg-blue-900/40 text-blue-300"
                      : progress.status === "completed"
                      ? "bg-green-900/40 text-green-300"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  {progress.status.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">Files Processed:</span>
                  <span className="text-xs font-semibold text-gray-300">
                    {progress.processedFiles || 0} / {progress.totalFiles}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#C86A3B] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress.totalFiles > 0 ? (progress.processedFiles / progress.totalFiles) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-900 p-2 rounded text-center">
                  <p className="text-[10px] text-gray-500">Images Uploaded</p>
                  <p className="text-lg font-bold text-green-400">{progress.uploadedImages || 0}</p>
                </div>
                <div className="bg-gray-900 p-2 rounded text-center">
                  <p className="text-[10px] text-gray-500">Products Created</p>
                  <p className="text-lg font-bold text-blue-400">{progress.products?.length || 0}</p>
                </div>
              </div>

              {progress.errors && progress.errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-800/40 rounded p-2">
                  <p className="text-[10px] text-red-300 font-semibold mb-1">
                    ⚠️ {progress.errors.length} Errors:
                  </p>
                  <div className="text-[9px] text-red-200 max-h-24 overflow-y-auto space-y-0.5">
                    {progress.errors.slice(0, 5).map((err, idx) => (
                      <div key={idx}>• {err.file || err.product}: {err.error}</div>
                    ))}
                    {progress.errors.length > 5 && <div>... and {progress.errors.length - 5} more</div>}
                  </div>
                </div>
              )}

              {progress.message && (
                <div className="bg-green-900/20 border border-green-800/40 rounded p-2">
                  <p className="text-xs text-green-300">✓ {progress.message}</p>
                </div>
              )}
            </div>

            {progress.status === "completed" && (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onComplete?.(progress.products);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 text-xs font-bold bg-green-900/40 hover:bg-green-900/60 border border-green-700 text-green-300 rounded-xl"
                >
                  ✓ Products Created
                </button>
              </div>
            )}

            {progress.status === "error" && (
              <button
                onClick={() => {
                  setProgress(null);
                  setSessionId(null);
                  setFolderPath("");
                }}
                className="w-full px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/60 text-[11px] text-gray-400 space-y-1">
          <p>💡 <strong>How it works:</strong></p>
          <p>• Enter your photos folder path</p>
          <p>• Photos are uploaded to Cloudinary</p>
          <p>• Products are created with auto descriptions & SEO</p>
          <p>• Products are saved directly to database</p>
          <p>• View and edit pricing in Product Manager</p>
        </div>
      </div>
    </div>
  );
}
