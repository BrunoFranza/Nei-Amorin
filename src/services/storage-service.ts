import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type StorageFolder = 'hero' | 'about' | 'logos' | 'news' | 'proposals' | 'gallery' | 'actions' | 'videos' | string;

export interface UploadResult {
  url: string;
  path: string;
  name?: string;
  size?: number;
  type?: string;
}

/**
 * Resolves any media URL
 */
export async function resolveMediaUrl(url?: string | null): Promise<string> {
  if (!url) return '';
  return url;
}

/**
 * Compresses an image file client-side before upload or local storage.
 * Keeps aspect ratio, scales to max 1600px width/height and ~85% quality.
 */
export async function compressImageClientSide(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    // If SVG, no need to compress with canvas
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({ blob: file, dataUrl });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to raw file read
        const reader = new FileReader();
        reader.onload = () => resolve({ blob: file, dataUrl: reader.result as string });
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, dataUrl });
          } else {
            resolve({ blob: file, dataUrl });
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve({ blob: file, dataUrl: reader.result as string });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

export async function uploadCampaignImage(
  siteId: string,
  folder: StorageFolder,
  file: File
): Promise<UploadResult> {
  const cleanSiteId = siteId || 'default-site';
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${cleanSiteId}/${folder}/${fileName}`;

  // 1. Client-side smart compression
  let fileToUpload: File | Blob = file;
  let compressedDataUrl = '';

  try {
    const compressed = await compressImageClientSide(file);
    fileToUpload = compressed.blob;
    compressedDataUrl = compressed.dataUrl;
  } catch (e) {
    console.warn('Image compression fallback:', e);
  }

  // 2. If Supabase Storage is configured, upload to bucket 'campaign-assets'
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('campaign-assets')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('campaign-assets')
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          path: filePath,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      } else if (error) {
        console.warn('Supabase upload returned error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase storage upload failed, falling back to local data URL:', e);
    }
  }

  // 3. Fallback for images
  if (compressedDataUrl) {
    return {
      url: compressedDataUrl,
      path: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a video file directly to Supabase Storage in the 'campaign-assets' bucket.
 * This guarantees the video is hosted on Supabase and accessible to all clients and visitors.
 */
export async function uploadCampaignVideo(
  siteId: string,
  folder: StorageFolder,
  file: File
): Promise<UploadResult> {
  const cleanSiteId = siteId || 'default-site';
  const fileExt = file.name.split('.').pop() || 'mp4';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${cleanSiteId}/${folder}/${fileName}`;

  // Check if Supabase is connected
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'O Supabase não está configurado na Vercel! Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para salvar o vídeo na nuvem para todos os visitantes.'
    );
  }

  // Upload to Supabase Storage bucket 'campaign-assets'
  const { data, error } = await supabase.storage
    .from('campaign-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'video/mp4',
    });

  if (error) {
    throw new Error(
      `Erro no Supabase Storage: ${error.message}. Verifique se o bucket "campaign-assets" foi criado como público no Supabase.`
    );
  }

  if (!data) {
    throw new Error('Falha ao obter confirmação de envio do Supabase Storage.');
  }

  // Get public URL from Supabase
  const { data: publicUrlData } = supabase.storage
    .from('campaign-assets')
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Não foi possível gerar a URL pública do vídeo no Supabase.');
  }

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export function getYouTubeThumbnail(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return '';
}

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return url;
}
