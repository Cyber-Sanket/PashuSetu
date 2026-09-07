import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, RefreshCw, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

interface PhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  label = 'Upload Photo',
  helperText = 'JPEG, PNG, or WebP up to 5MB',
  required = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    // 1. Validate MIME Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // 2. Validate Size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size exceeds the 5MB limit. Please choose a smaller photo.');
      return;
    }

    // 3. Set local preview immediately
    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);

    // 4. Upload to backend
    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const serverUrl = response.data.url;
      setPreviewUrl(serverUrl);
      onChange(serverUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.error || 'Failed to upload photo to server. Please try again.';
      setUploadError(msg);
      // Revert if upload failed
      setPreviewUrl(value || '');
      onChange(value || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl('');
    onChange('');
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {previewUrl && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Photo attached
          </span>
        )}
      </div>

      {/* Hidden Inputs for Standard Files and Mobile Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Main Container */}
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-2xl p-5 text-center transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="max-w-xs mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Click to choose or drag & drop photo
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
            </div>

            {/* Action Buttons for Mobile / Desktop */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Use Camera</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden group shadow-sm">
          <div className="relative aspect-video sm:aspect-[21/9] max-h-56 w-full flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className={`max-h-56 w-full object-contain transition-opacity duration-200 ${
                isUploading ? 'opacity-40' : 'opacity-100'
              }`}
            />

            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                <span className="text-xs font-semibold">Uploading & securing photo...</span>
              </div>
            )}
          </div>

          {/* Action Toolbar on Image */}
          <div className="p-2.5 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-300 text-[11px] truncate max-w-[200px]">
              {uploadSuccess ? '✓ Uploaded successfully' : 'Photo Attached'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-300 text-xs font-medium transition-colors border border-red-800/50"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
