import React, { useEffect, useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { Proposal, ProposalCategory } from '../../types';
import { ProposalCard } from '../../components/public/ProposalCard';

export const ProposalsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [categories, setCategories] = useState<ProposalCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadProposals = async () => {
      setLoading(true);
      try {
        const [propData, catData] = await Promise.all([
          dataStore.getProposals(currentSite.id, true),
          dataStore.getProposalCategories(currentSite.id, true),
        ]);
        setProposals(propData);
        setCategories(catData);
      } finally {
        setLoading(false);
      }
    };
    loadProposals();
  }, [currentSite?.id]);

  const filteredProposals = proposals.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-xs font-bold text-sky-700 border border-sky-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diretrizes e Compromissos 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Nosso Plano de Trabalho e Propostas
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Conheça as soluções práticas, fundamentadas em planejamento e viabilidade orçamentária, para transformar nossa realidade.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar proposta por palavra-chave (ex: saúde, bolsas, tarifa, segurança)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              selectedCategory === 'all'
                ? 'text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            style={selectedCategory === 'all' ? { backgroundColor: primaryColor } : {}}
          >
            Todas ({proposals.length})
          </button>

          {categories.map((cat) => {
            const count = proposals.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={isSelected ? { backgroundColor: primaryColor } : {}}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Proposals Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando propostas...</p>
        </div>
      ) : filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-base font-bold text-slate-700">Nenhuma proposta encontrada</p>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca ou os filtros de categoria.</p>
        </div>
      )}
    </div>
  );
};
