'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiService } from '@/lib/api';
import { Portfolio } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio/Themes';
import { Download, Copy, Check, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

export default function PublicPreviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!id) return;
    ApiService.getPortfolio(id)
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Portfolio not found or unavailable');
        setLoading(false);
      });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportHTML = () => {
    if (!portfolio) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.data.name} — Recruiter Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body class="bg-[#030712] text-slate-100 p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-5xl font-extrabold text-white">${portfolio.data.name}</h1>
    <p class="text-xl text-indigo-400 font-semibold">${portfolio.data.title}</p>
    <p class="text-sm text-slate-300">${portfolio.data.about}</p>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.data.name.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white space-y-4 text-center p-4">
        <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
        <p className="text-sm text-slate-400">The requested portfolio link might have expired or been removed.</p>
        <a href="/" className="btn-primary text-xs py-2 px-4">
          Create Portfolio
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] relative">
      {/* Floating Action Header Bar */}
      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-2 p-2 rounded-2xl transition-all duration-300 shadow-2xl"
        style={{
          background: 'rgba(10,15,30,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {!isCollapsed && (
          <>
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-secondary text-xs py-1.5 px-3"
              title="Share portfolio link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </button>

            <button
              type="button"
              onClick={handleExportHTML}
              className="btn-secondary text-xs py-1.5 px-3"
              title="Download standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" /> HTML
            </button>
          </>
        )}

        {/* Minimal Toggle to collapse/expand header bar for pristine viewing */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand toolbar' : 'Minimize toolbar'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Render Theme */}
      <PortfolioRenderer data={portfolio.data} theme={portfolio.theme} />
    </div>
  );
}


