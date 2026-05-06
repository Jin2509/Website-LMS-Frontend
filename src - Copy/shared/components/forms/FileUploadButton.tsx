import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Upload, X, FileText, Image, File, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadButtonProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onUpload?: (files: File[]) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function FileUploadButton({
  accept = '*',
  multiple = true,
  maxSize = 10,
  onUpload,
  variant = 'default',
  size = 'default',
  className = '',
}: FileUploadButtonProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed ${maxSize}MB limit`);
      return;
    }

    // Simulate upload
    setIsUploading(true);
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...files]);
      setIsUploading(false);
      toast.success(`${files.length} file(s) uploaded successfully`);
      
      if (onUpload) {
        onUpload(files);
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return Image;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return FileText;
    }
    return File;
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        {isUploading ? 'Uploading...' : 'Upload Files'}
      </Button>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => {
            const Icon = getFileIcon(file.name);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-indigo-300 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <button
                  onClick={() => removeFile(index)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}