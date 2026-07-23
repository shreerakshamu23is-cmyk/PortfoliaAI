'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Sparkles, AlertCircle, ArrowRight, Wand2, Loader2, FolderPlus } from 'lucide-react';
import { ApiService } from '@/lib/api';
import { PortfolioData } from '@/types/portfolio';
import { motion } from 'framer-motion';

interface ResumeUploadProps {
  onSuccess: (data: PortfolioData, rawText: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processResume = async (file?: File, text?: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setProgress(20);
    try {
      setProcessStep('Reading resume document...');
      await new Promise(r => setTimeout(r, 400));
      setProgress(55);

      setProcessStep('IBM Granite AI analyzing skills & experience...');
      const res = await ApiService.uploadResume(file, text);
      setProgress(90);

      setProcessStep('Constructing portfolio schema...');
      await new Promise(r => setTimeout(r, 400));
      setProgress(100);

      onSuccess(res.portfolio_data, res.raw_text);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process resume. Please try again or paste text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      processResume(accepted[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      if (rejections.length > 0) {
        const file = rejections[0].file;
        // If rejected due to strict MIME type, process file directly!
        if (file) {
          processResume(file);
        } else {
          setErrorMsg('Please select a valid PDF, DOCX, or TXT file.');
        }
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  const handleManualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processResume(files[0]);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your resume text before submitting.');
      return;
    }
    processResume(undefined, pastedText);
  };

  const handleSample = () => {
    const sample = `Alex Devlin\nSan Francisco, CA | alex@example.com | github.com/alexdevlin\n\nSUMMARY\nSenior Full-Stack Engineer with 4+ years of experience building scalable microservices, Next.js web applications, and AI integrations.\n\nSKILLS\nTypeScript, React, Next.js 14, Python, FastAPI, PostgreSQL, Docker, AWS, IBM Granite AI, Tailwind CSS\n\nEXPERIENCE\nSenior Software Engineer | Apex Cloud Systems (2023–Present)\n- Architected micro-frontend architecture using Next.js 14 server components, improving page speed by 42%.\n- Engineered asynchronous job queues processing 100,000+ document tasks daily with 99.9% uptime.\n\nFull Stack Engineer | Vanguard Labs (2021–2023)\n- Developed interactive real-time analytics dashboard with React and Tailwind CSS.\n\nEDUCATION\nB.S. in Computer Science, UC Berkeley (2017–2021)\n\nCERTIFICATIONS\nAWS Certified Solutions Architect (2024), IBM AI Developer Professional Certificate (2023)`;
    processResume(undefined, sample);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-3xl overflow-hidden" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.07]">
          <div className="inline-flex items-center gap-2 badge badge-indigo mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            IBM Granite AI · 2-minute portfolio
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Upload Your Resume
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            IBM Granite AI parses your skills, projects, and experience to build an animated, recruiter-optimized portfolio website.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pt-6">
          <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={activeTab === 'upload' ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : {}}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={activeTab === 'paste' ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : {}}
            >
              <FileText className="w-4 h-4" />
              Paste Text
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6 space-y-4">
          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Hidden Fail-Safe Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleManualFileChange}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />

          {/* Processing State */}
          {isProcessing ? (
            <div className="py-10 flex flex-col items-center gap-5 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} />
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  <Sparkles className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '4s' }} />
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">Analyzing with IBM Granite AI</p>
                <p className="text-xs text-indigo-300 font-mono">{processStep}</p>
              </div>
              <div className="w-full max-w-xs h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4f46e5, #a855f7, #ec4899)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            /* Dropzone Area */
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className="rounded-2xl p-10 text-center cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${isDragActive ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                  background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Upload className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {isDragActive ? 'Drop your resume file here' : 'Drag & drop your resume file'}
                </p>
                <p className="text-xs text-slate-400">
                  PDF, DOCX, TXT supported up to 10MB
                </p>
              </div>

              {/* Explicit Manual File Select Button */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  <FolderPlus className="w-4 h-4" />
                  Select File from Computer
                </button>

                <button
                  type="button"
                  onClick={handleSample}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Try Sample Resume
                </button>
              </div>
            </div>
          ) : (
            /* Paste Text Form */
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste your resume here — name, summary, skills, work experience, projects, education..."
                rows={9}
                className="input-dark font-mono text-xs resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSample}
                  className="text-xs text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Load Sample Resume Text
                </button>
                <button type="submit" className="btn-primary text-xs py-2.5 px-6">
                  <Wand2 className="w-4 h-4" />
                  Generate Portfolio
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
