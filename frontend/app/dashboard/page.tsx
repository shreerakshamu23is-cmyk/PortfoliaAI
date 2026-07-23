'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StorageService } from '@/lib/storage';
import { ResumeUpload } from '@/components/ResumeUpload';
import { Portfolio, ThemeType, PortfolioData } from '@/types/portfolio';
import {
  Sparkles, LayoutDashboard, FolderGit2, Eye, Edit3, Share2, Download,
  Trash2, Plus, Search, Check, TrendingUp, FileCode2, Wand2, Copy,
  ShieldCheck, Clock, Layers, Star, ExternalLink, Cpu, CheckCircle2,
  BookOpen, HelpCircle, FileText, ArrowRight, Code2, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const THEMES: { id: ThemeType; name: string; desc: string; tag: string }[] = [
  { id: 'modern-glass', name: 'Neo Minimal', desc: 'Luminous translucent glass cards, neon accents', tag: 'Software Engineer' },
  { id: 'executive-slate', name: 'Executive Slate', desc: 'Classic serif typography, authoritative gold accents', tag: 'Architect / Lead' },
  { id: 'cyberpunk-tech', name: 'Cyber Tech', desc: 'Pure black terminal aesthetic, cyan/emerald code', tag: 'DevOps / Backend' },
  { id: 'minimal-elegance', name: 'Apple Style', desc: 'Crisp minimal whitespace, refined typography', tag: 'UI / Product' },
  { id: 'dark-prism', name: 'Aurora ML', desc: 'Prismatic gradient backdrop, stat cards for AI/ML', tag: 'ML / Data Science' },
  { id: 'cyber-security', name: 'Cybersecurity', desc: 'Dark security matrix layout, red audit metrics', tag: 'Security / Audit' },
  { id: 'data-scientist', name: 'Data Scientist', desc: 'Analytics dashboard grid, metric charts', tag: 'Data Science' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolios' | 'themes' | 'guide'>('portfolios');

  // Load user portfolios from localStorage
  useEffect(() => {
    const saved = StorageService.getSavedPortfolios();
    setPortfolios(saved);
  }, []);

  const handleCopyLink = (id: string) => {
    const shareUrl = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    StorageService.saveDraftData(portfolio.data);
    StorageService.saveDraftTheme(portfolio.theme);
    router.push('/generate?step=3');
  };

  const handleDeletePortfolio = (id: string) => {
    const updated = portfolios.filter((p) => p.id !== id);
    setPortfolios(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioai_saved_list', JSON.stringify(updated));
    }
  };

  const handleUploadSuccess = (data: PortfolioData) => {
    StorageService.saveDraftData(data);
    router.push('/generate?step=2');
  };

  // Real data calculations
  const totalPortfolios = portfolios.length;
  const totalSkillsCount = portfolios.reduce((acc, p) => {
    return acc + (p.data.skills?.reduce((sAcc, cat) => sAcc + (cat.skills?.length || 0), 0) || 0);
  }, 0);
  const totalRolesCount = portfolios.reduce((acc, p) => acc + (p.data.experience?.length || 0), 0);
  const totalProjectsCount = portfolios.reduce((acc, p) => acc + (p.data.projects?.length || 0), 0);

  const filteredPortfolios = portfolios.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030712' }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-7 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5" /> IBM Granite AI Engine Ready
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Portfolio Management <span className="text-gradient">& Recruiter Hub</span>
            </h1>
            <p className="text-sm text-slate-400">
              Manage your generated portfolios, export standalone HTML files, or copy live share links for job applications.
            </p>
          </div>
          <Link href="/generate" className="btn-primary self-start md:self-auto">
            <Wand2 className="w-4 h-4" />
            Create New Portfolio
          </Link>
        </div>

        {/* AI System Diagnostics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl space-y-1" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">AI Model Status</span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> IBM Granite 3.0 8B Instruct
            </h4>
            <p className="text-[11px] text-slate-400">Deployed on watsonx.ai runtime engine</p>
          </div>

          <div className="p-5 rounded-2xl space-y-1" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Document Parser</span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> PDF / DOCX / TXT Supported
            </h4>
            <p className="text-[11px] text-slate-400">High-fidelity structure extraction</p>
          </div>

          <div className="p-5 rounded-2xl space-y-1" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Theme Library</span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> 7 Profession-Aware Themes
            </h4>
            <p className="text-[11px] text-slate-400">Framer Motion animations included</p>
          </div>
        </div>

        {/* Real User Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FolderGit2, color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', label: 'Active Portfolios', value: totalPortfolios.toString(), sub: totalPortfolios > 0 ? 'Saved & Shareable' : 'No portfolios yet' },
            { icon: Code2, color: 'text-cyan-400', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', label: 'Extracted Skills', value: totalSkillsCount.toString(), sub: 'Technical skill tags' },
            { icon: Briefcase, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', label: 'Work Experience Roles', value: totalRolesCount.toString(), sub: 'Job history items' },
            { icon: Layers, color: 'text-purple-400', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', label: 'Featured Projects', value: totalProjectsCount.toString(), sub: 'Parsed project cards' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">{s.label}</p>
                <h3 className="text-2xl font-extrabold text-white">{s.value}</h3>
                <p className="text-[10px] text-slate-500">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { id: 'portfolios', label: `My Portfolios (${portfolios.length})` },
              { id: 'themes', label: '7 Theme Library' },
              { id: 'guide', label: 'Recruiter Distribution Guide' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                style={activeTab === t.id ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'portfolios' && portfolios.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved portfolios..."
                className="input-dark pl-9 w-full text-xs"
              />
            </div>
          )}
        </div>

        {/* TAB 1: MY PORTFOLIOS */}
        {activeTab === 'portfolios' && (
          <div>
            {portfolios.length === 0 ? (
              <div className="space-y-8">
                {/* Empty State Card */}
                <div className="text-center py-12 px-6 rounded-3xl space-y-4"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <FolderGit2 className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Portfolios Saved Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Upload your PDF/DOCX resume below or paste raw text to create your first portfolio website.
                  </p>
                </div>

                {/* Embedded Resume Upload Studio for quick creation right on Dashboard */}
                <div className="pt-2">
                  <ResumeUpload onSuccess={handleUploadSuccess} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPortfolios.map((portfolio, i) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-hover rounded-2xl p-6 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="badge badge-indigo text-[10px]">{portfolio.theme}</span>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {portfolio.created_at ? new Date(portfolio.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                        {portfolio.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {portfolio.data.about || 'Recruiter-ready portfolio created with IBM Granite AI.'}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          `${portfolio.data.skills?.length || 0} Skill Groups`,
                          `${portfolio.data.experience?.length || 0} Roles`,
                          `${portfolio.data.projects?.length || 0} Projects`,
                        ].map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => handleEditPortfolio(portfolio)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <Link href={`/preview/${portfolio.id}`} target="_blank"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-300 hover:text-indigo-400 transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                        <button type="button" onClick={() => handleCopyLink(portfolio.id)}
                          className="p-2 rounded-lg transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {copiedId === portfolio.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>
                      </div>
                      <button type="button" onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THEMES LIBRARY */}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THEMES.map(t => (
              <div key={t.id} className="glass-hover rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge badge-purple">{t.tag}</span>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-base">{t.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                <Link href={`/generate?theme=${t.id}`} className="btn-secondary w-full justify-center text-xs py-2">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  Use This Theme
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: RECRUITER DISTRIBUTION GUIDE */}
        {activeTab === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. LinkedIn Profile Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add your shareable portfolio URL into your LinkedIn profile header under &quot;Contact Info&quot; or as a featured link in your bio to increase recruiter profile visits.
              </p>
            </div>

            <div className="p-6 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. GitHub README Badge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your shareable link directly inside your personal GitHub profile README repository (`username/username`).
              </p>
            </div>

            <div className="p-6 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Standalone HTML Backup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use the &quot;Export Standalone HTML&quot; button to download a zero-dependency HTML file. You can attach this directly to application emails or host it on GitHub Pages.
              </p>
            </div>

            <div className="p-6 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">4. ATS Optimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                IBM Granite AI automatically formats skills into standard tech taxonomy categories (Frontend, Backend, DevOps, AI) to match Applicant Tracking System filters.
              </p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
