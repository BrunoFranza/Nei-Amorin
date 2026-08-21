import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { CampaignEvent } from '../../types';
import { useTenant } from '../../context/TenantContext';

interface EventCardProps {
  event: CampaignEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { themeSettings } = useTenant();
  const eventDateObj = new Date(`${event.event_date}T00:00:00`);
  const day = eventDateObj.getDate();
  const monthName = eventDateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
  const weekday = eventDateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group">
      {/* Date badge */}
      <div className="flex items-center gap-4 shrink-0">
        <div
          className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-center font-bold shadow-xs"
          style={{
            backgroundColor: `${themeSettings?.primary_color || '#0284c7'}15`,
            color: themeSettings?.primary_color || '#0284c7',
          }}
        >
          <span className="text-xs uppercase font-extrabold tracking-wider">{monthName}</span>
          <span className="text-2xl font-black leading-none">{day}</span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide capitalize">
            {weekday}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Details & Location */}
      <div className="flex flex-col sm:items-end gap-2 text-xs text-slate-600 w-full sm:w-auto">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{event.event_time}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{event.location} {event.municipality ? `• ${event.municipality}` : ''}</span>
          </div>
        </div>

        {event.map_url && (
          <a
            href={event.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 mt-1"
          >
            <span>Ver no Mapa</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
