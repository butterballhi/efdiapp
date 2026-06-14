'use client';

import { useState, useCallback } from 'react';
import { CloudUploadIcon, ImageIcon, VideoIcon, CloseIcon } from './icons';

export default function UploadZone({ albumId, onUploadComplete, onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'done', 'error'

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFileToR2 = async (file) => {
    // Step 1: Get presigned URL from our API
    const presignRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        albumId,
      }),
    });

    if (!presignRes.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileKey } = await presignRes.json();

    // Step 2: Upload file directly to R2 via presigned URL
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(file);
    });

    return { fileKey, fileSize: file.size, mimeType: file.type };
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;
    setUploading(true);
    setUploadStatus('uploading');

    // If no albumId (mock mode), use the old mock behavior
    if (!albumId) {
      setTimeout(() => {
        setUploading(false);
        setUploadStatus('done');
        setFiles([]);
        if (onFilesSelected) onFilesSelected(files);
        setTimeout(() => setUploadStatus(''), 2000);
      }, 2000);
      return;
    }

    try {
      for (const file of files) {
        setUploadProgress(0);
        const type = file.type.startsWith('video/') ? 'video' : 'photo';

        const { fileKey, fileSize, mimeType } = await uploadFileToR2(file);

        // Step 3: Create media record in database
        if (onUploadComplete) {
          await onUploadComplete({
            fileName: file.name,
            fileKey,
            fileSize,
            mimeType,
            type,
          });
        }
      }

      setUploadStatus('done');
      setFiles([]);
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(''), 4000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="animate-fade-in-up">
      {/* Status messages */}
      {uploadStatus === 'done' && (
        <div className="mb-4 p-3 rounded-xl bg-status-ready-bg/50 border border-status-ready-bg animate-fade-in">
          <p className="text-sm text-status-ready-text font-body text-center">
            Yeay! Foto kalian udah disimpan~ ✨
          </p>
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="mb-4 p-3 rounded-xl bg-status-error-bg/50 border border-status-error-bg animate-fade-in">
          <p className="text-sm text-status-error-text font-body text-center">
            Ups, ada yang gagal. Coba lagi ya~ 😢
          </p>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-pink-bold bg-lavender-pastel/40 scale-[1.01]'
            : 'border-lavender-pastel bg-lavender-pastel/10 hover:border-purple-bold hover:bg-lavender-pastel/20'
          }
        `}
        onClick={() => document.getElementById('file-upload-input')?.click()}
        id="upload-dropzone"
      >
        <input
          type="file"
          id="file-upload-input"
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-pink-bold/20 scale-110' : 'bg-lavender-pastel/50'}`}>
            <CloudUploadIcon size={32} className={`transition-colors duration-300 ${isDragging ? 'text-pink-bold' : 'text-purple-bold'}`} />
          </div>
          <div>
            <p className="font-heading font-semibold text-text-primary text-base">
              {isDragging ? 'Lepaskan file di sini~ 💕' : 'Drag & drop foto atau video'}
            </p>
            <p className="text-text-secondary text-sm mt-1 font-body">
              atau <span className="text-pink-bold font-semibold underline">klik untuk pilih file</span>
            </p>
            <p className="text-text-secondary/60 text-xs mt-2 font-body">
              Mendukung JPG, PNG, HEIC, MP4, MOV
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-sm text-text-primary">
              {files.length} file dipilih
            </span>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary text-sm py-2 px-5 disabled:opacity-60 disabled:cursor-not-allowed"
              id="upload-button"
            >
              {uploading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Mengupload... {uploadProgress}%
                </>
              ) : (
                <>
                  <CloudUploadIcon size={16} />
                  Upload Semua
                </>
              )}
            </button>
          </div>

          {/* Progress bar during upload */}
          {uploading && (
            <div className="w-full h-2.5 rounded-full overflow-hidden bg-pink-pastel/30">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  background: 'linear-gradient(90deg, #FF8FB1, #FFF3B0)',
                  width: `${uploadProgress}%`,
                }}
              />
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-pink-pastel/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: file.type.startsWith('video/')
                      ? 'var(--lavender-pastel)'
                      : 'var(--pink-pastel)',
                  }}
                >
                  {file.type.startsWith('video/') ? (
                    <VideoIcon size={16} className="text-purple-bold" />
                  ) : (
                    <ImageIcon size={16} className="text-pink-bold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate font-body">{file.name}</p>
                  <p className="text-[11px] text-text-secondary font-body">{formatSize(file.size)}</p>
                </div>
                {!uploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-status-error-bg hover:text-status-error-text transition-all cursor-pointer flex-shrink-0 border-0 bg-transparent"
                  >
                    <CloseIcon size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
