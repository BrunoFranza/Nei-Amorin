import React from 'react';
import * as Icons from 'lucide-react';
import { Indicator } from '../../types';
import { useTenant } from '../../context/TenantContext';

interface IndicatorCardProps {
  indicator: Indicator;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  const { themeSettings } = useTenant();

  // Dynamic Lucide icon lookup with fallback
  const IconComponent = (Icons as any)[indicator.icon] || Icons.TrendingUp;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${themeSettings?.primary_color || '#0284c7'}15`,
          color: themeSettings?.primary_color || '#0284c7',
        }}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <span
          className="text-3xl sm:text-4xl font-extrabold tracking-tight block"
          style={{ color: themeSettings?.primary_color || '#0284c7' }}
        >
          {indicator.value}
        </span>
        <h3 className="text-base font-bold text-slate-900 leading-tight">
          {indicator.title}
        </h3>
        {indicator.description && (
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            {indicator.description}
          </p>
        )}
      </div>
    </div>
  );
};
