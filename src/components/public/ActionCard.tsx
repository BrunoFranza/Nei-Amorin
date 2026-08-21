import React from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { ActionItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ActionCardProps {
  action: ActionItem;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const formattedDate = new Date(action.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {action.image_url && (
        <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
          <ImageWithFallback
            src={action.image_url}
            alt={action.title}
            fallbackCategory="action"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold rounded-full">
            {action.category}
          </span>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {!action.image_url && (
            <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-1">
              {action.category}
            </span>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {action.municipality && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{action.municipality}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
            {action.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            {action.description}
          </p>
        </div>

        {action.link_url && (
          <a
            href={action.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline pt-2"
          >
            <span>Ver detalhes da ação</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
