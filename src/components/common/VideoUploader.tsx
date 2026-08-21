import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Video as VideoIcon, Check, Loader2, Link2, Sparkles, Play } from 'lucide-react';
import { uploadCampaignVideo, StorageFolder } from '../../services/storage-service';
import { useTenant } from '../../context/TenantContext';

interface VideoUploaderProps {
  currentVideoUrl?: string;
  folder?: StorageFolder;
  onVideoUploaded?: (url: string, storagePath?: string) => void;
  onUploadSuccess?: (url: string, storagePath?: string) => void;
  label?: string;
  description?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  currentVideoUrl,
  folder = 'videos',
  onVideoUploaded,
  onUploadSuccess,
  label = 'Vídeo de Fundo do Hero',
  description = 'Faça upload direto do arquivo (.mp4, .webm, .mov) do seu computador ou cole um link.',
}) => {
  const { currentSite } = useTenant();
  const [previewUrl, setPreviewUrl] = useState<string>(currentVideoUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyChange = (url: string, path?: string) => {
    if (onVideoUploaded) onVideoUploaded(url, path);
    if (onUploadSuccess) onUploadSuccess(url, path);
  };

  useEffect(() => {
    setPreviewUrl(currentVideoUrl || '');
  }, [currentVideoUrl]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setError('Por favor selecione um arquivo de vídeo válido (.mp4, .webm, .mov).');
      return;
    }

    // 50MB check warning for local performance
    if (file.size > 100 * 1024 * 1024) {
      setError('O vídeo é muito grande (máximo recomendado 100MB). Otimize ou reduza a resolução para a web.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const siteId = currentSite?.id || 'default-site';
      setUploadProgress(50);
      const result = await uploadCampaignVideo(siteId, folder, file);
      setUploadProgress(100);
      setPreviewUrl(result.url);
      notifyChange(result.url, result.path);
    } catch (err: any) {
      setError(err?.message || 'Falha ao processar o vídeo. Tente novamente.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    setPreviewUrl(manualUrl.trim());
    notifyChange(manualUrl.trim());
    setShowUrlInput(false);
    setManualUrl('');
  };

  const handleRemove = () => {
    setPreviewUrl('');
    notifyChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? 'Cancelar URL' : 'Colar Link'}</span>
          </button>
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showUrlInput && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2 animate-in fade-in">
          <input
            type="url"
            placeholder="https://... ou link do YouTube/Vimeo"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Aplicar
          </button>
        </form>
      )}

      {/* Preview or Upload Zone */}
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-xs">
          <div className="aspect-video w-full flex items-center justify-center">
            {previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be') ? (
              <div className="text-center p-4 text-white text-xs">
                <Play className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="font-bold">Vídeo do YouTube Vinculado</p>
                <p className="text-slate-400 text-[11px] truncate max-w-xs mt-1">{previewUrl}</p>
              </div>
            ) : (
              <video
                src={previewUrl}
                controls
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg text-xs backdrop-blur-md transition-colors flex items-center gap-1 cursor-pointer"
              title="Trocar vídeo"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold pr-1">Trocar</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs backdrop-blur-md transition-colors cursor-pointer"
              title="Remover vídeo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              {isUploading ? 'Processando e enviando vídeo...' : 'Clique para selecionar o vídeo ou arraste aqui'}
            </p>
            <p className="text-xs text-slate-500">
              Formatos aceitos: <strong>MP4, WebM, MOV</strong> (Envia direto do seu PC)
            </p>
          </div>

          {isUploading && (
            <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/m4v"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
