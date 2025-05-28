
import React, { useState } from 'react';
import { Upload, X, Image, Plus } from 'lucide-react';

interface ImageUploadProps {
  onImagesSelect: (imageUrls: string[]) => void;
  currentImages?: string[];
  label?: string;
  multiple?: boolean;
}

const ImageUpload = ({ onImagesSelect, currentImages = [], label = "Selecionar Imagens", multiple = true }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (files: FileList) => {
    const newImages: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        processedCount++;
        
        if (processedCount === files.length) {
          if (multiple) {
            onImagesSelect([...currentImages, ...newImages]);
          } else {
            onImagesSelect(newImages);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesSelect(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex items-center justify-center mb-2">
          {currentImages.length > 0 ? (
            <Plus className="h-8 w-8 text-gray-400" />
          ) : (
            <Image className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <p className="text-sm text-gray-600">
          {currentImages.length > 0 ? 'Adicionar mais imagens' : 'Clique ou arraste imagens aqui'}
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, JPEG até 10MB {multiple ? '(múltiplas imagens)' : '(uma imagem)'}
        </p>
      </div>
      
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;
