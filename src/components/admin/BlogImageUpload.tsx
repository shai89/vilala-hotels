'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface BlogImageUploadProps {
  value?: string; // URL of the current featured image
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function BlogImageUpload({
  value = '',
  onChange,
  disabled = false
}: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'vilala-blog');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  };

  const handleFileSelect = async (files: FileList) => {
    if (!files[0]) return;

    setUploading(true);
    
    try {
      const result = await uploadImage(files[0]);
      setUploadedImage({
        url: result.url,
        publicId: result.publicId
      });
      onChange(result.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = async () => {
    if (uploadedImage) {
      try {
        // Delete from Cloudinary
        await fetch(`/api/upload?publicId=${uploadedImage.publicId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    
    setUploadedImage(null);
    onChange('');
  };

  const currentImageUrl = uploadedImage?.url || value;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="mr-3 text-gray-600">מעלה תמונה...</span>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 text-sm mb-1">גרור תמונה לכאן או לחץ לבחירה</p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP עד 10MB</p>
          </>
        )}
      </div>

      {/* Image Preview */}
      {currentImageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="relative">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={currentImageUrl}
                alt="תצוגה מקדימה של תמונת המאמר"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Remove button */}
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-lg"
              title="הסר תמונה"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image source indicator */}
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                uploadedImage 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {uploadedImage ? 'תמונה מועלת' : 'תמונה מ-URL'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}