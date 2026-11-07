import React, { useRef, useState } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Product Image',
  placeholder = 'Upload image from device or capture with camera',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Compress & resize image to max 1000px using HTML5 Canvas to keep DB lean
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onChange(compressedDataUrl);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-xs text-gray-800">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove Image
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-[#16834A]/30 bg-[#F6F9F7] p-2 flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-48 object-contain rounded-xl bg-white"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md hover:bg-gray-100 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Change Photo
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md hover:bg-gray-100 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" /> Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#E5ECE7] hover:border-[#16834A] rounded-2xl p-5 bg-[#F6F9F7] transition-colors text-center">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-2xs flex items-center justify-center mx-auto mb-2 text-[#16834A]">
            <ImageIcon className="w-6 h-6" />
          </div>

          <p className="text-xs font-bold text-gray-800 mb-0.5">{placeholder}</p>
          <p className="text-[11px] text-gray-500 mb-3.5">PNG, JPG or WebP from gallery or camera</p>

          <div className="flex items-center justify-center gap-2.5">
            {/* Gallery Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>

            {/* Click Picture with Camera */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-white hover:bg-gray-100 border border-[#E5ECE7] text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#16834A]" />
              <span>Click Picture</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden standard file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden camera input for mobile direct capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-rose-600 text-[11px] font-semibold">{error}</p>
      )}
    </div>
  );
}
