import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { CampaignEvent } from '../../types';
import { EventCard } from '../../components/public/EventCard';

export const EventsPage: React.FC = () => {
  const { currentSite } = useTenant();
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await dataStore.getEvents(currentSite.id, true);
        setEvents(data);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [currentSite?.id]);

  const todayStr = new Date().toISOString().split('T')[0];

  const displayedEvents = events.filter((e) => {
    if (filter === 'upcoming') {
      return e.event_date >= todayStr;
    }
    return true;
  });

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-xs font-bold text-sky-700 border border-sky-100">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Próximos Encontros e Eventos
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Venha dialogar, apresentar suas ideias e caminhar conosco na construção de uma gestão transformadora.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('upcoming')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
            filter === 'upcoming'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Próximos Eventos
        </button>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todos os Eventos ({events.length})
        </button>
      </div>

      {/* Event list */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando agenda...</p>
        </div>
      ) : displayedEvents.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-4">
          {displayedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 max-w-xl mx-auto">
          <p className="text-base font-bold text-slate-700">Nenhum evento agendado</p>
          <p className="text-xs text-slate-500 mt-1">Fique atento às nossas redes sociais para novos anúncios.</p>
        </div>
      )}
    </div>
  );
};
