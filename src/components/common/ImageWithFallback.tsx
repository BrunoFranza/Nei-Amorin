import React, { useState } from 'react';
import { Image as ImageIcon, User, FileText, Shield, TrendingUp, Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: 'candidate' | 'proposal' | 'news' | 'action' | 'gallery' | 'general';
  fallbackSrc?: string;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  candidate: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
  proposal: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80',
  action: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  news: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80',
  gallery: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Imagem',
  className = '',
  fallbackCategory = 'general',
  fallbackSrc,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount === 0) {
      setRetryCount(1);
      setHasError(true);
    }
  };

  const activeSrc = !hasError && src ? src : (fallbackSrc || CATEGORY_FALLBACK_IMAGES[fallbackCategory] || CATEGORY_FALLBACK_IMAGES.general);

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="lazy"
      {...props}
    />
  );
};
