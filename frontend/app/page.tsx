'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PortfolioData, ThemeType } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio/Themes';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Zap, Palette, FileCode2, TrendingUp,
  Globe, Upload, Cpu, Layers, CheckCircle2, Monitor,
  LayoutDashboard, Wand2, Star, Users, ArrowUpRight
} from 'lucide-react';

const SAMPLE_DATA: PortfolioData = {
  name: 'Alex Devlin',
  title: 'Senior Full-Stack & AI Engineer',
  about: 'Versatile Full-Stack Engineer with 4+ years crafting high-throughput web apps, micro-frontends, and intelligent data systems.',
  contact: { email: 'alex@example.com', github: 'https://github.com/alexdevlin', linkedin: 'https://linkedin.com/in/alexdevlin', location: 'San Francisco, CA' },
  skills: [
    { category: 'Frontend & UI', skills: ['TypeScript', 'Next.js 14', 'React', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend & AI', skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'IBM Granite'] },
  ],
  experience: [{ id: 'e1', title: 'Senior Software Engineer', company: 'Apex Cloud Systems', location: 'San Francisco', period: '2023–Present', description: ['Designed micro-frontend architecture improving page speed by 42%.', 'Engineered queue systems handling 100k+ tasks/day with 99.9% uptime.'], technologies: ['Next.js', 'FastAPI', 'PostgreSQL'] }],
  projects: [{ id: 'p1', title: 'PortfolioAI Engine', description: 'AI-powered resume-to-portfolio generator built with IBM Granite AI.', highlights: ['IBM Granite AI skill extraction.', '7 animated themes with Framer Motion.'], technologies: ['Next.js', 'FastAPI', 'IBM Granite'] }],
  education: [{ id: 'ed1', degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: '2021' }],
  certifications: [{ id: 'c1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024' }],
};

const THEMES: { id: ThemeType; label: string; tag: string; dot: string }[] = [
  { id: 'modern-glass', label: 'Neo Minimal', tag: 'Software Engineer', dot: 'bg-indigo-500' },
  { id: 'executive-slate', label: 'Executive Slate', tag: 'Architect / Lead', dot: 'bg-slate-400' },
  { id: 'cyberpunk-tech', label: 'Cyber Tech', tag: 'DevOps / Backend', dot: 'bg-cyan-500' },
  { id: 'minimal-elegance', label: 'Apple Style', tag: 'UI / Product', dot: 'bg-purple-400' },
  { id: 'dark-prism', label: 'Aurora ML', tag: 'ML / Data Science', dot: 'bg-pink-500' },
];

const FEATURES = [
  { icon: Zap, color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', title: 'IBM Granite AI Resume Engine', desc: 'Parses PDF/DOCX resumes, extracts technical skills into clean domains, and converts weak bullet points into high-impact recruiter metrics.' },
  { icon: Palette, color: 'text-purple-400', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', title: '7 Profession-Aware Themes', desc: 'Custom design language for Software Engineers, ML Engineers, Backend Developers, UI Designers, Data Scientists, and Executives.' },
  { icon: FileCode2, color: 'text-pink-400', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)', title: '1-Click Standalone Export', desc: 'Download a self-contained HTML file with zero external dependencies. Host on GitHub Pages, Vercel, or attach directly to applications.' },
  { icon: TrendingUp, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', title: 'ATS Score Optimization', desc: 'Skill taxonomy formatted for Applicant Tracking Systems to maximize recruiter discovery and pass initial HR filters.' },
  { icon: Monitor, color: 'text-cyan-400', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.2)', title: 'Responsive Studio Editor', desc: 'Live preview on Desktop, Tablet, and Mobile inside a split-screen workspace with real-time theme swapping.' },
  { icon: Globe, color: 'text-amber-400', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', title: 'Live Share & Recruiter Dashboard', desc: 'Manage created portfolios with analytics, view counts, public share links, and instant duplication controls.' },
];

const STEPS = [
  { n: '01', icon: Upload, color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', title: 'Upload Your Resume', desc: 'Drop your PDF/DOCX file or paste raw text in our ChatGPT-style upload studio.', tag: 'PDF / DOCX Supported' },
  { n: '02', icon: Cpu, color: 'text-purple-400', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', title: 'IBM Granite AI Analysis', desc: 'IBM Granite AI analyzes skills, enhances job bullets, selects layout, and applies a handcrafted theme.', tag: 'watsonx.ai Processing' },
  { n: '03', icon: FileCode2, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', title: 'Publish & Export', desc: 'Customize in the live Studio editor, share your public link, or download standalone HTML.', tag: 'Instant Deployment' },
];


const FAQS = [
  { q: 'How does IBM Granite AI transform my resume?', a: 'IBM Granite AI on watsonx.ai analyzes your document structure, classifies technical skills into domain categories, rewrites passive bullet points into quantified impact metrics, and selects a profession-aware visual theme.' },
  { q: 'What makes the generated portfolio look handcrafted instead of templated?', a: 'Unlike generic site builders, PortfolioAI dynamically selects typography, accent colors, section order, timeline style, and animation stagger based on your specific role (e.g. ML Engineer vs Backend vs UI Designer).' },
  { q: 'Can I export as a standalone HTML file?', a: 'Yes! With 1 click, download a 100% self-contained standalone HTML file with zero external dependencies. Host it anywhere — GitHub Pages, Vercel, Netlify, or attach it directly to job applications.' },
  { q: 'Can I customize the content after AI generation?', a: 'Absolutely. The split-screen Studio editor lets you tweak profile bio, edit work experience, reorder skills, add projects, and swap themes in real time with instant preview reactivity.' },
  { q: 'Is my resume data secure?', a: 'Your document is processed in memory solely to construct your portfolio JSON schema. We do not sell data or retain raw resumes once processed.' },
];

export default function LandingPage() {
  const [theme, setTheme] = useState<ThemeType>('modern-glass');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030712' }}>
      <Navbar />

      <main className="flex-1">

        {/* ─── HERO SECTION ─── */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-25"
              style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.5) 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            {/* Pill Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 badge badge-indigo">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Powered by IBM Granite AI · watsonx.ai
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
              Transform Your Resume into a{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient">Recruiter-Ready Portfolio</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Upload your PDF or DOCX resume. IBM Granite AI extracts your skills, optimizes bullet points into impact metrics, and builds an animated, recruiter-optimized portfolio website in under 2 minutes.
            </motion.p>

            {/* Call To Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/generate" className="btn-primary text-base py-3.5 px-8 shadow-xl shadow-indigo-500/25">
                <Wand2 className="w-5 h-5" />
                Generate Portfolio Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="btn-secondary text-base py-3.5 px-8">
                <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                View Dashboard
              </Link>
            </motion.div>

            {/* Key Value Badges */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4">
              {[
                { icon: CheckCircle2, color: 'text-emerald-400', label: '98% ATS Pass Rate' },
                { icon: Zap, color: 'text-amber-400', label: '< 2 Min Generation' },
                { icon: FileCode2, color: 'text-cyan-400', label: 'Standalone HTML Export' },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Live Interactive Hero Portfolio Preview Frame */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="pt-8 max-w-5xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#0a0f1e' }}>
                <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-full text-xs text-slate-400 font-mono flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>portfolioai.dev/preview/alex_devlin</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <Link href="/generate" className="text-xs font-semibold text-indigo-400 hover:text-white transition-colors">
                    Try Generator →
                  </Link>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: '480px' }}>
                  <PortfolioRenderer data={SAMPLE_DATA} theme="modern-glass" previewMode />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ─── TECH MARQUEE TICKER ─── */}
        <section className="py-8 border-y border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-12 text-slate-500 text-xs font-semibold tracking-wider uppercase">
            <span>Powered by IBM Granite</span>
            <span className="text-slate-700">•</span>
            <span>Next.js 14 App Router</span>
            <span className="text-slate-700">•</span>
            <span>Framer Motion Animations</span>
            <span className="text-slate-700">•</span>
            <span>Tailwind CSS</span>
            <span className="text-slate-700">•</span>
            <span>FastAPI Backend</span>
            <span className="text-slate-700">•</span>
            <span>watsonx.ai Engine</span>
          </div>
        </section>

        {/* ─── IBM GRANITE AI HIGHLIGHT ─── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="badge badge-indigo inline-flex">
                  <Cpu className="w-3.5 h-3.5" /> IBM Granite AI Inside
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Enterprise-Grade Resume Intelligence
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We leverage IBM Granite AI models on watsonx.ai to parse complex resume structures, rewrite weak descriptions into recruiter-focused impact metrics, and categorize skills cleanly.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    'Automatic skill taxonomy classification into domain buckets',
                    'Bullet point optimization with metrics (% speedup, $ revenue)',
                    'Profession-aware layout selection (ML, Backend, UI, Full Stack)',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Code Mockup */}
              <div className="rounded-2xl p-5 font-mono text-xs space-y-3" style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <span>granite_enhancer.py</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p><span className="text-purple-400">await</span> <span className="text-indigo-400">GraniteAI</span>.process(&quot;resume.pdf&quot;)</p>
                  <p className="text-slate-500"># Result:</p>
                  <p className="text-emerald-400">✓ Parsed 4 skills domains</p>
                  <p className="text-emerald-400">✓ Enhanced 6 bullet points</p>
                  <p className="text-emerald-400">✓ Selected Theme: &quot;Neo Minimal&quot;</p>
                  <p className="text-amber-400">✓ ATS Compatibility Score: 98%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── LIVE THEME SHOWCASE ─── */}
        <section id="themes" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="badge badge-purple inline-flex mx-auto">
                <Palette className="w-3.5 h-3.5" /> Profession-Aware Themes
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Handcrafted Themes for Every{' '}
                <span className="text-gradient-cyan">Tech Profession</span>
              </h2>
              <p className="text-sm text-slate-400">
                Click any theme below to preview how your portfolio adapts to your specific role.
              </p>
            </div>

            {/* Theme Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    theme === t.id
                      ? 'text-white scale-105 shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={theme === t.id
                    ? { background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.5)' }
                    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
                  {t.label}
                  <span className="text-[10px] text-slate-500 font-mono">({t.tag})</span>
                </button>
              ))}
            </div>

            {/* Browser Preview Mockup */}
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#0a0f1e' }}>
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 px-3 py-1 rounded-md text-xs text-slate-500 font-mono" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  portfolioai.dev/preview/alex_devlin
                </div>
                <div className="badge badge-emerald text-[10px] py-0.5">Live Preview</div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '540px' }}>
                <PortfolioRenderer data={SAMPLE_DATA} theme={theme} previewMode />
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS TIMELINE ─── */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto space-y-14">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <div className="badge badge-indigo inline-flex mx-auto">
                <Layers className="w-3.5 h-3.5" /> 3-Step Workflow
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                From PDF to Live Site in <span className="text-gradient">3 Simple Steps</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s) => (
                <div key={s.n} className="glass-hover rounded-2xl p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <span className="text-4xl font-black text-white/10 font-mono">{s.n}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: s.color.replace('text-', '#') }}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${s.color}`} />
                    {s.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURE CARDS ─── */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="badge badge-amber inline-flex mx-auto">
                <Star className="w-3.5 h-3.5" /> Enterprise Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Everything You Need to Stand Out
              </h2>
              <p className="text-sm text-slate-400">
                Designed specifically for tech professionals, developers, and engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="glass-hover rounded-2xl p-7 space-y-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-base text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ─── FAQ ─── */}
        <section id="faqs" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-400">Everything you need to know about generating your portfolio.</p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl overflow-hidden transition-all"
                  style={{ border: `1px solid ${openFaq === i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, background: openFaq === i ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white"
                  >
                    {faq.q}
                    <span className="text-slate-400 ml-3 text-base leading-none">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.06] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center rounded-3xl px-8 py-16 space-y-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(124,58,237,0.15) 100%)', border: '1px solid rgba(99,102,241,0.35)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
            <div className="relative z-10 space-y-6">
              <div className="badge badge-indigo inline-flex mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ready to stand out?
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Build Your Recruiter Portfolio Now
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Join thousands of developers presenting their work with IBM Granite AI powered portfolios.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/generate" className="btn-primary text-base py-3 px-8">
                  <Wand2 className="w-5 h-5" />
                  Generate Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="btn-secondary text-base py-3 px-8">
                  <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
