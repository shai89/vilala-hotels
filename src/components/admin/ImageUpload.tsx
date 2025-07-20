'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';

interface ImageData {
  id: string;
  publicId: string;
  secureUrl: string;
  altText: string | null;
  title: string | null;
  description: string | null;
  isCover: boolean;
  sortOrder: number;
  width: number;
  height: number;
  format: string;
  size: number;
  qualityScore: number | null;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  warnings?: string[];
  suggestions?: string[];
}

interface ImageUploadProps {
  entityType: 'cabin' | 'room';
  entityId: string;
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  maxImages?: number;
  allowBatchUpload?: boolean;
  onEditImage?: (index: number) => void;
}

export function ImageUpload({
  entityType,
  entityId,
  images,
  onImagesChange,
  maxImages = 10,
  allowBatchUpload = true,
  onEditImage,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more images.`);
      return;
    }

    // Initialize progress tracking
    const progressItems: UploadProgress[] = imageFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadProgress(progressItems);

    if (allowBatchUpload && imageFiles.length > 1) {
      await handleBatchUpload(imageFiles);
    } else {
      await handleSingleUploads(imageFiles);
    }
  }, [images, maxImages, allowBatchUpload]);

  const handleBatchUpload = async (files: File[]) => {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      setUploadProgress(prev => prev.map(item => ({ ...item, status: 'uploading' })));

      const response = await fetch('/api/images/upload-batch', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newImages = result.results
          .filter((r: any) => r.success)
          .map((r: any) => r.image);
        
        onImagesChange([...images, ...newImages]);
        
        setUploadProgress(prev => prev.map((item, index) => ({
          ...item,
          status: result.results[index].success ? 'completed' : 'error',
          error: result.results[index].error,
          warnings: result.results[index].validation?.warnings,
          suggestions: result.results[index].validation?.suggestions,
        })));
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Batch upload error:', error);
      setUploadProgress(prev => prev.map(item => ({ 
        ...item, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })));
    }
  };

  const handleSingleUploads = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);

      try {
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, status: 'uploading' } : item
        ));

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          onImagesChange([...images, result.image]);
          setUploadProgress(prev => prev.map((item, index) => 
            index === i ? { 
              ...item, 
              status: 'completed',
              warnings: result.validation?.warnings,
              suggestions: result.validation?.suggestions,
            } : item
          ));
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Single upload error:', error);
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } : item
        ));
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onImagesChange(images.filter(img => img.id !== imageId));
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCover: true }),
      });

      const result = await response.json();

      if (result.success) {
        onImagesChange(images.map(img => ({
          ...img,
          isCover: img.id === imageId,
        })));
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Set cover error:', error);
      alert('Failed to set cover image');
    }
  };

  const clearProgress = () => {
    setUploadProgress([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-lg font-medium text-gray-900">
              גרור תמונות כאן או 
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-600 hover:text-purple-700 mx-1"
              >
                לחץ לבחירה
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WebP עד 10MB • מקסימום {maxImages} תמונות
            </p>
            <p className="text-sm text-gray-500">
              רזולוציה מינימלית: 800x600 פיקסלים
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">העלאת תמונות</h3>
            <button
              onClick={clearProgress}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              נקה
            </button>
          </div>
          <div className="space-y-2">
            {uploadProgress.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {item.file.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'completed' ? 'הושלם' :
                       item.status === 'error' ? 'שגיאה' :
                       item.status === 'uploading' ? 'מעלה...' : 'ממתין'}
                    </span>
                  </div>
                  {item.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.error && (
                    <p className="text-sm text-red-600 mt-1">{item.error}</p>
                  )}
                  {item.warnings && item.warnings.length > 0 && (
                    <div className="text-sm text-yellow-600 mt-1">
                      {item.warnings.map((warning, i) => (
                        <p key={i}>⚠️ {warning}</p>
                      ))}
                    </div>
                  )}
                  {item.suggestions && item.suggestions.length > 0 && (
                    <div className="text-sm text-blue-600 mt-1">
                      {item.suggestions.map((suggestion, i) => (
                        <p key={i}>💡 {suggestion}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                image.isCover 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={getOptimizedImageUrl(image.publicId, { 
                    variant: 'card',
                    quality: 'auto:best' 
                  })}
                  alt={image.altText || 'Property image'}
                  fill
                  className="object-cover"
                />
                
                {/* Cover Badge */}
                {image.isCover && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      תמונה ראשית
                    </span>
                  </div>
                )}

                {/* Quality Score */}
                {image.qualityScore && (
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      image.qualityScore >= 0.8 ? 'bg-green-100 text-green-800' :
                      image.qualityScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(image.qualityScore * 100)}%
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isCover && (
                    <button
                      onClick={() => handleSetCover(image.id)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                      title="Set as cover image"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onEditImage ? onEditImage(index) : setSelectedImageIndex(index)}
                    className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                    title="Edit image"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-red-500/90 hover:bg-red-500 p-2 rounded-full transition-colors"
                    title="Delete image"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-3 bg-white">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {image.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {image.width}x{image.height} • {image.format.toUpperCase()} • {Math.round(image.size / 1024)}KB
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">אין תמונות עדיין</p>
          <p className="text-sm text-gray-400 mt-1">העלה תמונות כדי להתחיל</p>
        </div>
      )}
    </div>
  );
}