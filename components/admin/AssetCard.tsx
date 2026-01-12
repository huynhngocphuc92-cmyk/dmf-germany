'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetUpdateSchema, type AssetUpdateData } from '@/lib/validations/schemas';
import { Save, X, Loader2, Edit2, Trash2, Upload, XCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { uploadThemeImage, updateSiteConfig } from '@/actions/theme-actions';

interface AssetCardProps {
  item: { key: string; value: string; asset_type: string; id?: string };
  onUpdate: (key: string, value: string) => Promise<void>;
  onDelete?: (key: string) => Promise<void>;
}

// Helper function to validate if a string is a valid image URL/path
const isValidImagePath = (value: string | null | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  // Check if it starts with "/" (relative path) or "http://" or "https://" (absolute URL)
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');
};

export default function AssetCard({ item, onUpdate, onDelete }: AssetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const assetType = item.asset_type?.toUpperCase() || 'TEXT';
  const isImageType = assetType === 'IMAGE';

  // Initialize Form
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { isSubmitting, errors } 
  } = useForm<AssetUpdateData>({
    resolver: zodResolver(assetUpdateSchema),
    defaultValues: {
      key: item.key,
      value: item.value || '', // Ensure value is never null for input
      asset_type: item.asset_type as any
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPG, PNG, WebP, GIF allowed.');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum 5MB allowed.');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: AssetUpdateData) => {
    try {
      setIsUploading(true);
      let finalValue = data.value || "";

      // If it's an image type and a file was selected, upload it first
      if (isImageType && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadResult = await uploadThemeImage(formData);
        
        if (uploadResult.error || !uploadResult.url) {
          toast.error(uploadResult.error || 'Failed to upload image');
          setIsUploading(false);
          return;
        }
        
        finalValue = uploadResult.url;
        toast.success('Image uploaded successfully');
      }

      // Update the config in database
      const updateResult = await updateSiteConfig(
        data.key,
        finalValue || null,
        item.asset_type as any
      );

      if (updateResult.error) {
        toast.error(updateResult.error);
        setIsUploading(false);
        return;
      }

      // Update local state
      await onUpdate(data.key, finalValue);
      
      toast.success('Inhalt erfolgreich aktualisiert');
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error('Fehler beim Speichern');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isEditing) {
    return (
      <div className="group bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">
              {item.key}
            </span>
            <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-slate-100 text-slate-500 rounded border border-slate-200">
              {assetType}
            </span>
          </div>

          {/* CONDITIONAL RENDERER */}
          {assetType === 'IMAGE' ? (
            // CASE 1: IMAGE PREVIEW
            <div className="relative w-full max-w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden flex items-center justify-center hover:border-blue-500 transition-colors">
              {isValidImagePath(item.value) ? (
                <Image 
                  src={item.value} 
                  alt={item.key}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageIcon size={24} className="opacity-50" />
                  <span className="text-xs">
                    {item.value ? 'Invalid image path' : 'No image set'}
                  </span>
                  {item.value && (
                    <span className="text-[10px] font-mono text-slate-300 truncate max-w-full px-2">
                      {item.value}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : assetType === 'COLOR' ? (
            // CASE 2: COLOR PREVIEW
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-slate-200 shadow-sm flex-shrink-0"
                style={{ backgroundColor: item.value || '#ffffff' }} 
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-slate-900 font-medium truncate">{item.value || 'No color'}</span>
                <span className="text-xs text-slate-500">Hex Code</span>
              </div>
            </div>
          ) : (
            // CASE 3: DEFAULT TEXT
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm break-all min-h-[3rem]">
              {item.value || <span className="text-slate-300 italic">Empty</span>}
            </p>
          )}
        </div>
        
        <div className="px-4 pb-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          {onDelete && (
            <button 
              onClick={() => onDelete(item.key)}
              className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono font-bold text-blue-600">
          Editing: {item.key}
        </span>
      </div>
      
      {/* Dynamic Input based on Asset Type */}
      <div className="mb-3">
        {isImageType ? (
          // IMAGE TYPE: File Input with Preview
          <div className="space-y-3">
            {/* Current Image Preview */}
            {item.value && !previewUrl && isValidImagePath(item.value) && (
              <div className="relative w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden">
                <Image 
                  src={item.value} 
                  alt={item.key}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
            )}
            {/* Fallback UI for invalid image path in edit mode */}
            {item.value && !previewUrl && !isValidImagePath(item.value) && (
              <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon size={24} className="opacity-50" />
                <span className="text-xs">Invalid image path</span>
                <span className="text-[10px] font-mono text-slate-300 truncate max-w-full px-2">
                  {item.value}
                </span>
              </div>
            )}
            
            {/* New File Preview */}
            {previewUrl && (
              <div className="relative w-full h-32 bg-slate-50 border-2 border-dashed border-blue-300 rounded-lg overflow-hidden">
                <Image 
                  src={previewUrl} 
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
                <button
                  type="button"
                  onClick={clearFileSelection}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}
            
            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id={`file-input-${item.key}`}
              />
              <label
                htmlFor={`file-input-${item.key}`}
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-blue-400 cursor-pointer transition-colors"
              >
                <Upload size={18} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : 'Choose new image file'}
                </span>
              </label>
              <p className="text-xs text-slate-400 mt-1 text-center">
                JPG, PNG, WebP, GIF (Max 5MB)
              </p>
            </div>
            
            {/* Hidden input for form validation (keeps existing value if no new file) */}
            <input type="hidden" {...register('value')} value={item.value || ''} />
          </div>
        ) : assetType === 'COLOR' ? (
          // COLOR TYPE: Color Input
          <input 
            type="color"
            {...register('value')} 
            className="w-full h-12 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer" 
            placeholder="#000000"
          />
        ) : assetType === 'TEXT' || !item.asset_type ? (
          // TEXT TYPE: Textarea
          <textarea 
            {...register('value')} 
            className="w-full p-3 text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            rows={3} 
            placeholder="Enter content..."
          />
        ) : (
          // DEFAULT: Text Input
          <input 
            {...register('value')} 
            className="w-full p-3 text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter value..."
          />
        )}
        {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button 
          type="button" 
          onClick={cancelEdit} 
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || isUploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {(isSubmitting || isUploading) ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isUploading ? 'Uploading...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
