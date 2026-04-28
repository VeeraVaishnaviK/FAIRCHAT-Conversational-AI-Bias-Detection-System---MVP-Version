import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 flex flex-col items-center justify-center min-h-[240px]",
          dragActive ? "border-blue-500 bg-blue-50/50" : "border-slate-300 bg-white hover:border-slate-400",
          file ? "border-green-500 bg-green-50/20" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
          disabled={isLoading}
        />

        {!file ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer text-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold text-slate-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500">
              CSV files only (max. 100MB)
            </p>
          </label>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg font-medium text-slate-900 truncate max-w-[250px]">
                {file.name}
              </span>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary w-full max-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Analyze Dataset'
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
