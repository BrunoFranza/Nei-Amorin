import React from 'react';

interface StatusBadgeProps {
  status?: 'active' | 'inactive' | 'draft' | 'published' | 'unpublished' | boolean;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  let isPositive = false;
  let text = label || '';

  if (typeof status === 'boolean') {
    isPositive = status;
    text = text || (status ? 'Publicado' : 'Rascunho');
  } else {
    switch (status) {
      case 'active':
      case 'published':
        isPositive = true;
        text = text || (status === 'active' ? 'Ativo' : 'Publicado');
        break;
      case 'inactive':
      case 'draft':
      case 'unpublished':
      default:
        isPositive = false;
        text = text || (status === 'inactive' ? 'Inativo' : 'Rascunho');
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPositive ? 'bg-emerald-500' : 'bg-slate-400'
        }`}
      />
      {text}
    </span>
  );
};
