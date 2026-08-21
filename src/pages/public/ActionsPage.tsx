import React, { useEffect, useState } from 'react';
import { Award, MapPin, Calendar, Search } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { ActionItem } from '../../types';
import { ActionCard } from '../../components/public/ActionCard';

export const ActionsPage: React.FC = () => {
  const { currentSite } = useTenant();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadActions = async () => {
      setLoading(true);
      try {
        const data = await dataStore.getActions(currentSite.id, true);
        setActions(data);
      } finally {
        setLoading(false);
      }
    };
    loadActions();
  }, [currentSite?.id]);

  const municipalities = Array.from(new Set(actions.map((a) => a.municipality).filter(Boolean)));

  const filteredActions = actions.filter((a) => {
    const matchesMun = selectedMunicipality === 'all' || a.municipality === selectedMunicipality;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMun && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-xs font-bold text-sky-700 border border-sky-100">
          <Award className="w-3.5 h-3.5" />
          <span>Prestação de Contas Aberta</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Nossa Atuação e Conquistas
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Acompanhe os projetos entregues, recursos destinados e a fiscalização ativa em benefício de nossa gente.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ação ou projeto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {municipalities.length > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              >
                <option value="all">Todos os municípios</option>
                {municipalities.map((mun) => (
                  <option key={mun} value={mun}>
                    {mun}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando ações...</p>
        </div>
      ) : filteredActions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-base font-bold text-slate-700">Nenhuma ação encontrada</p>
        </div>
      )}
    </div>
  );
};
