'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ResumeUpload } from '@/components/ResumeUpload';
import { AIGenerationSteps } from '@/components/AIGenerationSteps';
import { PortfolioEditor } from '@/components/editor/PortfolioEditor';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { StorageService } from '@/lib/storage';
import { ApiService } from '@/lib/api';
import { PortfolioData, ThemeType, Portfolio } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, Download, Share2, Eye, Edit3, Check, Wand2, ArrowRight, Copy, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';

function GenerateStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = Number(searchParams.get('step')) || 1;
  const initialTheme = (searchParams.get('theme') as ThemeType) || 'modern-glass';

  const [step, setStep] = useState<number>(initialStep);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [theme, setTheme] = useState<ThemeType>(initialTheme);
  const [savedPortfolio, setSavedPortfolio] = useState<Portfolio | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('preview');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const draft = StorageService.getDraftData();
    const savedTheme = StorageService.getDraftTheme();
    if (draft) {
      setPortfolioData(draft);
      setTheme(initialTheme !== 'modern-glass' ? initialTheme : savedTheme);
    }
  }, [initialTheme]);

  const handleUploadSuccess = (data: PortfolioData) => {
    setPortfolioData(data);
    StorageService.saveDraftData(data);
    setStep(2);
  };

  const handleGenerationComplete = () => {
    setStep(3);
  };

  const handleDataChange = (newData: PortfolioData) => {
    setPortfolioData(newData);
    StorageService.saveDraftData(newData);
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    StorageService.saveDraftTheme(newTheme);
  };

  const handleSaveAndPublish = async () => {
    if (!portfolioData) return;
    setIsSaving(true);
    try {
      const created = await ApiService.createPortfolio(portfolioData, theme);
      setSavedPortfolio(created);
      StorageService.savePortfolioToHistory(created);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportHTML = () => {
    if (!portfolioData) return;
    const htmlContent = generateStandaloneHTML(portfolioData, theme);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.name.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareUrl = typeof window !== 'undefined' && savedPortfolio ? `${window.location.origin}/preview/${savedPortfolio.id}` : '';

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between" style={{ background: '#030712' }}>
      <Navbar currentStep={step} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">

        {/* STEP 1: UPLOAD RESUME */}
        {step === 1 && (
          <div className="py-8">
            <ResumeUpload onSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* STEP 2: 7-STEP AI GENERATION EXPERIENCE */}
        {step === 2 && (
          <div className="py-12 flex items-center justify-center flex-1">
            <AIGenerationSteps onComplete={handleGenerationComplete} />
          </div>
        )}

        {/* STEP 3: CUSTOMIZE & LIVE PREVIEW (STUDIO EDITOR) */}
        {step === 3 && !portfolioData && (
          <div className="py-16 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">No Portfolio Data Found</h2>
            <p className="text-xs text-slate-400">Please upload your resume to generate your portfolio website.</p>
            <Button variant="primary" size="sm" onClick={() => setStep(1)}>
              Upload Resume
            </Button>
          </div>
        )}

        {step === 3 && portfolioData && (
          <div className="space-y-6 flex-1 flex flex-col">

            {/* Top Toolbar Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    StorageService.clearDraft();
                    setPortfolioData(null);
                    setStep(1);
                  }}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Re-upload
                </Button>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Portfolio Studio Editor
                    <Badge variant="indigo" pulse>
                      Live Reactivity
                    </Badge>
                  </h2>
                  <p className="text-xs text-slate-400">Tweak bio details, skills, experience, or swap themes in real time.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExportHTML}
                  leftIcon={<Download className="w-3.5 h-3.5 text-indigo-400" />}
                >
                  Export Standalone HTML
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAndPublish}
                  isLoading={isSaving}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  {isSaving ? 'Publishing...' : 'Save & Get Share Link'}
                </Button>
              </div>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex sm:hidden items-center p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                onClick={() => setActiveTabMobile('editor')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTabMobile === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTabMobile('preview')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTabMobile === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </button>
            </div>

            {/* Split Screen Studio Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
              <div className={`lg:col-span-5 ${activeTabMobile === 'editor' ? 'block' : 'hidden sm:block'}`}>
                <PortfolioEditor
                  data={portfolioData}
                  onChange={handleDataChange}
                  selectedTheme={theme}
                  onThemeChange={handleThemeChange}
                />
              </div>

              <div className={`lg:col-span-7 ${activeTabMobile === 'preview' ? 'block' : 'hidden sm:block'}`}>
                <PortfolioPreview
                  data={portfolioData}
                  theme={theme}
                  onExportHTML={handleExportHTML}
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: PUBLISHED SUCCESS */}
        {step === 4 && portfolioData && savedPortfolio && (
          <div className="py-16 max-w-2xl mx-auto w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="badge badge-emerald inline-flex">
                <ShieldCheck className="w-3.5 h-3.5" /> IBM Granite Verified Portfolio
              </span>
              <h2 className="text-3xl font-extrabold text-white">Your Recruiter Portfolio is Live!</h2>
              <p className="text-xs text-slate-400">Share your live portfolio URL with recruiters or download a standalone HTML file.</p>
            </div>

            <div className="p-4 rounded-2xl flex items-center justify-between gap-3 font-mono text-xs text-indigo-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <span className="truncate">{shareUrl}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyLink}
                leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <Edit3 className="w-4 h-4" /> Edit Portfolio
              </button>

              <a href={`/preview/${savedPortfolio.id}`} target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2.5 px-6 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" /> Open Live Portfolio
              </a>

              <button type="button" onClick={handleExportHTML} className="btn-secondary text-sm py-2.5 px-6 flex items-center gap-2">
                <Download className="w-4 h-4 text-purple-400" /> Download Standalone HTML
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function GenerateStudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <GenerateStudioContent />
    </Suspense>
  );
}

// Standalone HTML Generator Function
function generateStandaloneHTML(data: PortfolioData, theme: ThemeType): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} — Recruiter Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #030712; color: #f3f4f6; }
    .gradient-text { background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .glass-card { background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="p-6 md:p-12">
  <div class="max-w-4xl mx-auto space-y-12">
    <header class="space-y-4">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Recruiter Portfolio</span>
      <h1 class="text-5xl font-extrabold text-white mt-2">${data.name}</h1>
      <p class="text-xl text-indigo-400 font-semibold">${data.title}</p>
      <p class="text-sm text-slate-300 leading-relaxed max-w-2xl">${data.about}</p>
      <div class="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 font-mono">
        ${data.contact.email ? `<span>Email: ${data.contact.email}</span>` : ''}
        ${data.contact.github ? `<span>GitHub: ${data.contact.github}</span>` : ''}
        ${data.contact.linkedin ? `<span>LinkedIn: ${data.contact.linkedin}</span>` : ''}
      </div>
    </header>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2">Technical Skills</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${data.skills.map(cat => `
          <div class="glass-card p-5 rounded-2xl">
            <h3 class="text-xs font-bold text-indigo-400 uppercase mb-3">${cat.category}</h3>
            <div class="flex flex-wrap gap-1.5">
              ${cat.skills.map(s => `<span class="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-300">${s}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2">Work Experience</h2>
      <div class="space-y-4">
        ${data.experience.map(exp => `
          <div class="glass-card p-6 rounded-2xl space-y-3">
            <div class="flex justify-between items-baseline">
              <h3 class="text-base font-bold text-white">${exp.title} <span class="text-indigo-400">@ ${exp.company}</span></h3>
              <span class="text-xs text-slate-500 font-mono">${exp.period}</span>
            </div>
            <ul class="text-xs text-slate-300 space-y-1.5">
              ${exp.description.map(d => `<li>• ${d}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-white border-b border-white/10 pb-2">Featured Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${data.projects.map(p => `
          <div class="glass-card p-6 rounded-2xl space-y-2">
            <h3 class="text-base font-bold text-white">${p.title}</h3>
            <p class="text-xs text-slate-300 leading-relaxed">${p.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
  </div>
</body>
</html>`;
}
