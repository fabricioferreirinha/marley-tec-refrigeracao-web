"use client"

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, formatFileSize, isValidImageFile, resizeImage } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface ImageUploadProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number // em MB
  className?: string
  disabled?: boolean
  allowReorder?: boolean
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5,
  className,
  disabled = false,
  allowReorder = true
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (disabled) return

    const fileArray = Array.from(files)
    const remainingSlots = maxFiles - value.length

    if (fileArray.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Muitos arquivos",
        description: `Você pode adicionar no máximo ${remainingSlots} imagem(ns) a mais.`
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        // Validar tipo de arquivo
        if (!isValidImageFile(file)) {
          throw new Error(`${file.name} não é um tipo de arquivo válido`)
        }

        // Validar tamanho
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`${file.name} é muito grande. Máximo ${maxSize}MB`)
        }

        // Redimensionar imagem
        const resizedBlob = await resizeImage(file, 800, 0.8)
        
        // Simular upload (aqui você integraria com seu serviço de upload)
        const formData = new FormData()
        formData.append('file', resizedBlob as File, file.name)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Erro ao fazer upload de ${file.name}`)
        }

        const data = await response.json()
        
        // Atualizar progresso manualmente
        const progress = Math.round(((index + 1) / fileArray.length) * 100)
        setUploadProgress(progress)
        
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedUrls])

      toast({
        variant: "default",
        title: "Upload concluído!",
        description: `${uploadedUrls.length} imagem(ns) carregada(s) com sucesso.`,
        className: "border-green-200 bg-green-50 text-green-800"
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido no upload"
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [value, onChange, maxFiles, maxSize, disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect, disabled])

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return
    const newUrls = value.filter((_, index) => index !== indexToRemove)
    onChange(newUrls)
  }

  // Funções de drag and drop para reordenação
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!allowReorder || disabled) return
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!allowReorder || disabled) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    if (!allowReorder || disabled || draggedIndex === null) return
    e.preventDefault()

    if (draggedIndex === dropIndex) return

    const newUrls = [...value]
    const draggedUrl = newUrls[draggedIndex]
    
    // Remove o item da posição original
    newUrls.splice(draggedIndex, 1)
    
    // Insere na nova posição
    newUrls.splice(dropIndex, 0, draggedUrl)
    
    onChange(newUrls)
    setDraggedIndex(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          disabled 
            ? "border-gray-200 bg-gray-50 cursor-not-allowed" 
            : "border-gray-300 hover:border-blue-400 cursor-pointer",
          uploading && "pointer-events-none opacity-50"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => {
          if (!disabled && !uploading) {
            const input = document.createElement('input')
            input.type = 'file'
            input.multiple = true
            input.accept = 'image/*'
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files
              if (files) handleFileSelect(files)
            }
            input.click()
          }
        }}
      >
        <div className="flex flex-col items-center text-center">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600 mb-2">Fazendo upload...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs" />
              <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Clique para enviar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP até {maxSize}MB cada ({maxFiles - value.length} restantes)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview das Imagens */}
      {value.length > 0 && (
        <div className="space-y-2">
          {allowReorder && !disabled && (
            <p className="text-xs text-gray-500 flex items-center">
              <GripVertical className="w-3 h-3 mr-1" />
              Arraste para reordenar as imagens
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div 
                key={`${url}-${index}`} 
                className={cn(
                  "relative group",
                  allowReorder && !disabled && "cursor-move",
                  draggedIndex === index && "opacity-50"
                )}
                draggable={allowReorder && !disabled}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropReorder(e, index)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Indicador de posição */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
                
                {/* Controles */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {allowReorder && !disabled && (
                      <div className="bg-white rounded-full p-1 shadow-md">
                        <GripVertical className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    {!disabled && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 shadow-md"
                        onClick={() => handleRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 