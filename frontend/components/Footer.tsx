'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <Sparkles className="text-white" style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="font-bold text-lg text-white">
                Portfolio<span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Transform raw PDF/DOCX resumes into recruiter-ready, animated portfolio websites in under 2 minutes — powered by IBM Granite AI on watsonx.ai.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">IBM Granite watsonx.ai — Operational</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/generate" className="hover:text-white transition-colors">AI Generator Studio</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
              <li><Link href="/#themes" className="hover:text-white transition-colors">5 Animated Themes</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Standalone HTML Export</Link></li>
            </ul>
          </div>

          {/* Features links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Features</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-white transition-colors">ATS Score Optimizer</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">IBM Granite Extraction</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Responsive Preview</Link></li>
              <li><Link href="/#faqs" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PortfolioAI. Built for developers & tech professionals.
          </p>
          <div className="flex items-center gap-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
