'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

interface ImageUploadProps {
  value?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  folder = 'vilala-cabins',
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

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
    if (value.length >= maxImages) {
      alert(`ניתן להעלות עד ${maxImages} תמונות בלבד`);
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).slice(0, maxImages - value.length).map(uploadImage);
      const results = await Promise.all(uploadPromises);
      onChange([...value, ...results]);
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

  const removeImage = async (index: number) => {
    const imageToRemove = value[index];
    
    try {
      // Delete from Cloudinary
      await fetch(`/api/upload?publicId=${imageToRemove.publicId}`, {
        method: 'DELETE',
      });
      
      // Remove from state
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    } catch (error) {
      console.error('Delete error:', error);
      alert('שגיאה במחיקת התמונה');
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const setCoverImage = (index: number) => {
    if (index === 0) return; // Already first
    moveImage(index, 0);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="mr-3 text-gray-600">מעלה תמונות...</span>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 mb-2">גרור תמונות לכאן או לחץ לבחירה</p>
            <p className="text-sm text-gray-500">PNG, JPG, WebP עד 10MB</p>
            <p className="text-sm text-gray-500">עד {maxImages} תמונות ({value.length}/{maxImages})</p>
          </>
        )}
      </div>

      {/* Uploaded Images */}
      {value.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">תמונות שהועלו</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((image, index) => (
              <div key={image.publicId} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={image.url}
                    alt={`תמונה ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    {index !== 0 && (
                      <button
                        onClick={() => setCoverImage(index)}
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                        title="הגדר כתמונה ראשית"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    )}
                    
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      title="מחק תמונה"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Cover Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    תמונה ראשית
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}