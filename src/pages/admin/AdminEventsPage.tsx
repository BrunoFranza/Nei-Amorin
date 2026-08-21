import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { CampaignEvent } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminEventsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<CampaignEvent>>({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    event_time: '19:00',
    location: '',
    municipality: '',
    map_url: '',
    display_order: 1,
    is_active: true,
  });

  const loadEvents = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getEvents(currentSite.id);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setForm({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '19:00',
      location: '',
      municipality: currentSite?.slug === 'site-mariana-dias' ? 'Campinas' : 'São Paulo',
      map_url: '',
      display_order: events.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: CampaignEvent) => {
    setSelectedEvent(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedEvent) {
      await dataStore.updateEvent({
        ...selectedEvent,
        ...form,
      } as CampaignEvent);
    } else {
      await dataStore.createEvent({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadEvents();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteEvent(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadEvents();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agenda Oficial & Encontros
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre os atos públicos, plenárias, caminhadas e entrevistas da campanha.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Evento na Agenda</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando eventos...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] uppercase">{new Date(`${ev.event_date}T00:00:00`).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  <span className="text-lg leading-none">{new Date(`${ev.event_date}T00:00:00`).getDate()}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {ev.title}
                    </h3>
                    <StatusBadge active={ev.is_active} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      {ev.event_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ev.location} {ev.municipality ? `• ${ev.municipality}` : ''}
                    </span>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-slate-600 line-clamp-1">{ev.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ev)}
                  className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete(ev.id);
                    setDeleteDialogOpen(true);
                  }}
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhum evento agendado</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEvent ? 'Editar Evento da Agenda' : 'Novo Evento'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome do Evento *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Grande Plenária com Lideranças Comunitárias"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Data do Evento *
              </label>
              <input
                type="date"
                required
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Horário *
              </label>
              <input
                type="text"
                required
                value={form.event_time}
                onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                placeholder="Ex: 19:00"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Local / Endereço *
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ex: Clube Atlético Central, Av. Paulista, 1000"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Município
              </label>
              <input
                type="text"
                value={form.municipality || ''}
                onChange={(e) => setForm({ ...form, municipality: e.target.value })}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link do Google Maps (Opcional)
              </label>
              <input
                type="url"
                value={form.map_url || ''}
                onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Descrição / Orientações aos Participantes
            </label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Informações sobre credenciamento, transporte, pauta..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-700">Visível na agenda pública</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Salvar Evento
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Evento"
        description="Tem certeza que deseja remover este evento da agenda pública?"
      />
    </div>
  );
};
