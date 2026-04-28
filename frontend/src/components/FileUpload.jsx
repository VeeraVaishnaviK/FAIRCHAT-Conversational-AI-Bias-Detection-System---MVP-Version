import { useState, useRef } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function FileUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)
    setFileName(file.name)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(pct)
        },
      })

      setProgress(100)
      setTimeout(() => {
        setUploading(false)
        if (onUploadSuccess) onUploadSuccess(response.data)
      }, 500)

    } catch (err) {
      setUploading(false)
      setProgress(0)
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    }
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center cursor-pointer min-h-[180px] p-8 text-center transition-all duration-500 rounded-[22px] ${
          isDragging ? 'shadow-glow-lg border-indigo-500/50 scale-[1.02]' : 'border-white/5 hover:border-white/10'
        }`}
        style={{
          background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
          border: '1.5px solid',
          borderColor: isDragging ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)',
        }}
        id="file-upload-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!uploading ? (
          <>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <span className="text-xl">📄</span>
            </div>
            <p className="text-sm font-semibold text-white/90 mb-1">
              {isDragging ? 'Drop it here!' : 'Click or drag dataset to analyze'}
            </p>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
              CSV Format Required &bull; Max 10MB
            </p>
          </>
        ) : (
          <div className="w-full max-w-xs animate-pulse">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
              Processing {fileName}...
            </p>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] mt-2 font-medium text-slate-500">
              {progress}% Analyzed
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 rounded-xl text-xs font-semibold animate-fade-in text-center" style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.15)',
          color: '#fb7185',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
