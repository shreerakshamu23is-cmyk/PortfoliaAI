'use client';

import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Download, Share2, Eye, Code, ExternalLink, Check } from 'lucide-react';
import { PortfolioData, ThemeType } from '@/types/portfolio';
import { PortfolioRenderer } from './portfolio/Themes';

interface PortfolioPreviewProps {
  data: PortfolioData;
  theme: ThemeType;
  portfolioId?: string;
  onExportHTML?: () => void;
  onEdit?: () => void;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  data,
  theme,
  portfolioId,
  onExportHTML,
  onEdit
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] h-[700px] border-[12px] border-slate-800 rounded-[40px] shadow-2xl overflow-y-auto my-4';
      case 'tablet':
        return 'w-[768px] h-[750px] border-[8px] border-slate-800 rounded-2xl shadow-xl overflow-y-auto my-4';
      case 'desktop':
      default:
        return 'w-full h-full rounded-2xl border border-slate-800 overflow-hidden';
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined' && portfolioId) {
      const shareUrl = `${window.location.origin}/preview/${portfolioId}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col h-full space-y-4">
      {/* Top Toolbar Controls */}
      <div className="flex items-center justify-between p-3 glass-panel rounded-xl border border-slate-800">
        {/* Device Viewport Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
              deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
              deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
              deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Edit Portfolio</span>
            </button>
          )}

          {portfolioId && (
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          )}

          {onExportHTML && (
            <button
              type="button"
              onClick={onExportHTML}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Standalone HTML</span>
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 min-h-[600px] flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800 p-2 overflow-x-auto">
        <div className={`transition-all duration-300 ${getContainerWidth()}`}>
          <PortfolioRenderer data={data} theme={theme} />
        </div>
      </div>
    </div>
  );
};
