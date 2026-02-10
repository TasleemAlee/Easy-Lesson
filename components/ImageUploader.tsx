
import React, { useState, useCallback, useMemo } from 'react';
import { UploadIcon, TrashIcon, SparklesIcon } from './icons';

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, onSubmit, isLoading }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const newImageFiles = [...imageFiles, ...newFiles];
    setImageFiles(newImageFiles);
    onImagesChange(newImageFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [imageFiles, onImagesChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  
  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    const newImageFiles = [...imageFiles];
    
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    newImageFiles.splice(index, 1);

    setPreviews(newPreviews);
    setImageFiles(newImageFiles);
    onImagesChange(newImageFiles);
  };

  const hasImages = useMemo(() => imageFiles.length > 0, [imageFiles.length]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Upload Lesson Images</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Add one or more images of your lesson pages.</p>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
        }`}
      >
        <div className="flex flex-col items-center">
          <UploadIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {hasImages && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Uploaded Pages:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group aspect-w-1 aspect-h-1 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover border border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <button onClick={() => removeImage(index)} className="p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 hover:bg-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!hasImages || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Solve Exercises
          </>
        )}
      </button>
    </div>
  );
};