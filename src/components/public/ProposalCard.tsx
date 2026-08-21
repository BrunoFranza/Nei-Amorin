import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Proposal } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { Modal } from '../common/Modal';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const { themeSettings } = useTenant();
  const [showDetail, setShowDetail] = useState(false);

  const IconComponent = (Icons as any)[proposal.icon || 'FileText'] || Icons.FileText;
  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
        {proposal.image_url && (
          <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
            <ImageWithFallback
              src={proposal.image_url}
              alt={proposal.title}
              fallbackCategory="proposal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {proposal.category && (
              <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 rounded-full shadow-xs">
                {proposal.category.name}
              </span>
            )}
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {!proposal.image_url && proposal.category && (
              <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-1">
                {proposal.category.name}
              </span>
            )}

            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                {proposal.title}
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {proposal.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline pt-2 cursor-pointer"
            style={{ color: primaryColor }}
          >
            <span>Ler proposta completa</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detalhes da Proposta" maxWidth="lg">
        <div className="space-y-4">
          {proposal.image_url && (
            <ImageWithFallback
              src={proposal.image_url}
              alt={proposal.title}
              fallbackCategory="proposal"
              className="w-full h-56 object-cover rounded-xl"
            />
          )}

          {proposal.category && (
            <span className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full">
              Eixo: {proposal.category.name}
            </span>
          )}

          <h3 className="text-xl font-bold text-slate-900">{proposal.title}</h3>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
            {proposal.description}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
