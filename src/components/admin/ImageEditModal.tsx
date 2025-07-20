'use client';

import React, { useState, useEffect } from 'react';
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

interface ImageEditModalProps {
  image: ImageData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedImage: ImageData) => void;
  onDelete?: (imageId: string) => void;
}

export function ImageEditModal({ image, isOpen, onClose, onSave, onDelete }: ImageEditModalProps) {
  const [formData, setFormData] = useState({
    altText: image.altText || '',
    title: image.title || '',
    description: image.description || '',
    isCover: image.isCover,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        altText: image.altText || '',
        title: image.title || '',
        description: image.description || '',
        isCover: image.isCover,
      });
    }
  }, [image, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSave(result.image);
        onClose();
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAltText = async () => {
    setIsGeneratingAlt(true);
    try {
      const response = await fetch('/api/images/generate-alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: image.publicId }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, altText: result.altText }));
      } else {
        throw new Error(result.error || 'Alt text generation failed');
      }
    } catch (error) {
      console.error('Alt text generation error:', error);
      alert('Failed to generate alt text');
    } finally {
      setIsGeneratingAlt(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">עריכת תמונה</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getOptimizedImageUrl(image.publicId, { 
                    variant: 'large',
                    quality: 'auto:best' 
                  })}
                  alt={formData.altText || 'Property image'}
                  fill
                  className="object-cover"
                />
                
                {formData.isCover && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      תמונה ראשית
                    </span>
                  </div>
                )}

                {image.qualityScore && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      image.qualityScore >= 0.8 ? 'bg-green-100 text-green-800' :
                      image.qualityScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      איכות: {Math.round(image.qualityScore * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">פרטים טכניים</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>רזולוציה:</span>
                    <span>{image.width}x{image.height} פיקסלים</span>
                  </div>
                  <div className="flex justify-between">
                    <span>פורמט:</span>
                    <span>{image.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>גודל קובץ:</span>
                    <span>{Math.round(image.size / 1024)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>מזהה Cloudinary:</span>
                    <span className="font-mono text-xs">{image.publicId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-6">
              {/* Cover Image Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCover"
                  checked={formData.isCover}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCover: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isCover" className="text-sm font-medium text-gray-700">
                  הגדר כתמונה ראשית
                </label>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת תמונה
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="כותרת תמונה לשיפור SEO"
                />
              </div>

              {/* Alt Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
                    טקסט אלטרנטיבי (Alt Text)
                  </label>
                  <button
                    onClick={handleGenerateAltText}
                    disabled={isGeneratingAlt}
                    className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                  >
                    {isGeneratingAlt ? 'יוצר...' : '🤖 צור אוטומטי'}
                  </button>
                </div>
                <textarea
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="תיאור התמונה לנגישות ו-SEO"
                />
                <p className="text-xs text-gray-500 mt-1">
                  חשוב לנגישות ו-SEO. תאר מה נראה בתמונה באופן תמציתי.
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור מפורט
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="תיאור מפורט יותר של התמונה (אופציונלי)"
                />
              </div>

              {/* SEO Preview */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">תצוגה מקדימה ל-SEO</h4>
                <div className="space-y-1 text-sm">
                  <div className="text-blue-800">
                    <span className="font-medium">Title:</span> {formData.title || 'Property image'}
                  </div>
                  <div className="text-blue-600">
                    <span className="font-medium">Alt:</span> {formData.altText || 'No alt text'}
                  </div>
                  {formData.description && (
                    <div className="text-blue-600">
                      <span className="font-medium">Description:</span> {formData.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Tips */}
              {image.qualityScore && image.qualityScore < 0.8 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">💡 טיפים לשיפור איכות</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• וודא שהתמונה חדה ולא מטושטשת</li>
                    <li>• השתמש בתאורה טובה ונכונה</li>
                    <li>• הימנע מתמונות עם רעש או רזולוציה נמוכה</li>
                    <li>• צלם בזווית מעניינת וייצוגית</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isSaving ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}