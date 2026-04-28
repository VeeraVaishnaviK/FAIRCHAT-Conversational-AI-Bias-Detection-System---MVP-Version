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
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    // Validate file size (max 10MB)
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
    <div className="w-full max-w-xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative cursor-pointer rounded-2xl p-10 text-center transition-all duration-300"
        style={{
          background: isDragging
            ? 'rgba(99, 102, 241, 0.08)'
            : 'rgba(255, 255, 255, 0.02)',
          border: isDragging
            ? '2px dashed #6366f1'
            : '2px dashed rgba(255, 255, 255, 0.12)',
          boxShadow: isDragging ? '0 0 40px rgba(99, 102, 241, 0.15)' : 'none',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload-input"
        />

        {/* Upload Icon */}
        <div className="mb-4">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            {uploading ? '⏳' : '📁'}
          </div>
        </div>

        {!uploading ? (
          <>
            <p className="text-lg font-semibold mb-1" style={{ color: '#f1f5f9' }}>
              Drop your CSV file here
            </p>
            <p className="text-sm" style={{ color: '#64748b' }}>
              or <span style={{ color: '#818cf8' }}>click to browse</span> • Max 10MB
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>
              Uploading {fileName}...
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden mt-3" style={{
              background: 'rgba(255, 255, 255, 0.06)',
            }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: '#64748b' }}>
              {progress}% complete
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 rounded-xl text-sm animate-fade-in" style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          color: '#fb7185',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
