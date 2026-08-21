import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { VideoItem } from '../../types';
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../lib/storage-service';
import { Modal } from '../common/Modal';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = video.thumbnail_url || getYouTubeThumbnail(video.youtube_url);
  const embedUrl = getYouTubeEmbedUrl(video.youtube_url);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
        {/* Video Thumbnail with Play Button */}
        <div
          onClick={() => setIsPlaying(true)}
          className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden group"
        >
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>

          <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-md flex items-center gap-1">
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>{video.category}</span>
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <h3
              onClick={() => setIsPlaying(true)}
              className="font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors cursor-pointer text-base line-clamp-2"
            >
              {video.title}
            </h3>
            {video.description && (
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {video.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 pt-1"
          >
            <span>Assistir vídeo</span>
            <Play className="w-3 h-3 fill-rose-600" />
          </button>
        </div>
      </div>

      {/* Video Playback Modal */}
      <Modal isOpen={isPlaying} onClose={() => setIsPlaying(false)} title={video.title} maxWidth="4xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {video.description && (
            <p className="text-sm text-slate-600 leading-relaxed px-1">
              {video.description}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
