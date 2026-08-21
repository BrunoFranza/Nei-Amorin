import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader2, Link2, Sparkles } from 'lucide-react';
import { uploadCampaignImage, StorageFolder } from '../../services/storage-service';
import { useTenant } from '../../context/TenantContext';

interface ImageUploaderProps {
  currentImageUrl?: string;
  folder?: StorageFolder;
  onImageUploaded?: (url: string, storagePath?: string) => void;
  onUploadSuccess?: (url: string, storagePath?: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

const SAMPLE_PRESETS: { label: string; url: string }[] = [
  { label: 'Retrato Candidato', url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80' },
  { label: 'Infraestrutura / Obras', url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80' },
  { label: 'Agronegócio / Campo', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80' },
  { label: 'Segurança / Proteção', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Emprego / Trabalho', url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80' },
  { label: 'Encontro / Povo', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  folder = 'news',
  onImageUploaded,
  onUploadSuccess,
  label = 'Imagem',
  description = 'Suporta JPG, PNG, WebP, SVG de qualquer tamanho (otimizado automaticamente)',
  aspectRatio = 'auto',
}) => {
  const { currentSite } = useTenant();
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyChange = (url: string, path?: string) => {
    if (onImageUploaded) onImageUploaded(url, path);
    if (onUploadSuccess) onUploadSuccess(url, path);
  };

  useEffect(() => {
    setPreviewUrl(currentImageUrl || '');
  }, [currentImageUrl]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP, etc.).');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(25);

    try {
      const siteId = currentSite?.id || 'default-site';
      setUploadProgress(60);
      const result = await uploadCampaignImage(siteId, folder, file);
      setUploadProgress(100);
      setPreviewUrl(result.url);
      notifyChange(result.url, result.path);
    } catch (err: any) {
      setError(err?.message || 'Erro ao processar upload da imagem.');
    } finally {
      setIsUploading(false);
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
    if (manualUrl.trim()) {
      setPreviewUrl(manualUrl.trim());
      notifyChange(manualUrl.trim());
      setShowUrlInput(false);
      setManualUrl('');
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    notifyChange(url);
    setShowPresets(false);
  };

  const handleRemove = () => {
    setPreviewUrl('');
    notifyChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square max-w-[240px]';
      case 'video': return 'aspect-video max-w-[420px]';
      case 'portrait': return 'aspect-[3/4] max-w-[240px]';
      default: return 'max-h-60';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="block text-sm font-semibold text-slate-800">{label}</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setShowPresets(!showPresets); setShowUrlInput(false); }}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fotos Prontas</span>
            </button>
            <button
              type="button"
              onClick={() => { setShowUrlInput(!showUrlInput); setShowPresets(false); }}
              className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{showUrlInput ? 'Ocultar Link' : 'Inserir Link URL'}</span>
            </button>
          </div>
        </div>
      )}

      {showPresets && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 animate-in fade-in">
          <p className="text-xs font-bold text-amber-900">Escolha uma foto modelo para preencher rapidamente:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SAMPLE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p.url)}
                className="flex items-center gap-2 p-1.5 bg-white border border-amber-200/80 rounded-lg hover:border-amber-400 hover:shadow-xs transition-all text-left text-xs font-medium text-slate-800 cursor-pointer"
              >
                <img src={p.url} alt={p.label} className="w-8 h-8 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showUrlInput && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in">
          <input
            type="url"
            placeholder="Cole o link da imagem (ex: https://...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 cursor-pointer"
          >
            Aplicar
          </button>
        </form>
      )}

      {previewUrl ? (
        <div className="relative group inline-block rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full object-cover rounded-xl ${getAspectClass()}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-white/90 text-slate-800 rounded-full hover:bg-white transition-colors cursor-pointer shadow-md"
              title="Trocar imagem"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors cursor-pointer shadow-md"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver ? 'border-sky-500 bg-sky-50/50 scale-[0.99]' : 'border-slate-300 hover:border-sky-400 bg-slate-50/60 hover:bg-sky-50/30'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-800">Otimizando e enviando imagem...</p>
              <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-sky-600 hover:underline">Clique para enviar do computador/celular</span> ou arraste o arquivo
                </p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 font-semibold">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};
