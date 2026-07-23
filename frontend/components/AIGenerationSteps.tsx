'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Code2, Sparkles, Cpu, Palette, CheckCircle2, ShieldCheck, Wand2, Loader2
} from 'lucide-react';

interface AIGenerationStepsProps {
  onComplete: () => void;
}

const GENERATION_STEPS = [
  { id: 1, title: 'Reading Resume & Document Structure', icon: FileText, desc: 'Extracting plain text, layout hierarchy, and contact metadata...', duration: 900 },
  { id: 2, title: 'Extracting Skills & Experience Taxonomy', icon: Code2, desc: 'IBM Granite AI classifying technical domains (Frontend, Backend, AI/ML)...', duration: 1100 },
  { id: 3, title: 'Enhancing Bullet Points & Metric Calculation', icon: Sparkles, desc: 'Converting passive descriptions into recruiter-ready impact statements...', duration: 1200 },
  { id: 4, title: 'Analyzing Profession & Engineering Domain', icon: Cpu, desc: 'Determining optimal visual layout and typography scale for your role...', duration: 1000 },
  { id: 5, title: 'Applying Profession-Aware Theme', icon: Palette, desc: 'Selecting color palette, Framer Motion transitions, and component layout...', duration: 1000 },
  { id: 6, title: 'Optimizing ATS Pass Rate', icon: ShieldCheck, desc: 'Verifying keyword placement against Applicant Tracking System filters...', duration: 800 },
  { id: 7, title: 'Portfolio Ready!', icon: CheckCircle2, desc: 'Finalizing live preview frame and shareable portfolio link...', duration: 600 },
];

export const AIGenerationSteps: React.FC<AIGenerationStepsProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < GENERATION_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, GENERATION_STEPS[currentStepIndex].duration);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStepIndex, onComplete]);

  const activeStep = GENERATION_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / GENERATION_STEPS.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 space-y-8 text-center">

        {/* Pulsing AI Orbit Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/40 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <Wand2 className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Step Info Header */}
        <div className="space-y-2">
          <span className="badge badge-indigo inline-flex">
            <Cpu className="w-3.5 h-3.5" /> IBM Granite AI · watsonx.ai
          </span>
          <h2 className="text-2xl font-bold text-white">
            {activeStep.title}
          </h2>
          <p className="text-xs text-indigo-300 max-w-md mx-auto h-8">
            {activeStep.desc}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Step {currentStepIndex + 1} of {GENERATION_STEPS.length}</span>
            <span className="text-indigo-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Vertical Checklist Tracker */}
        <div className="pt-4 text-left space-y-3 max-w-md mx-auto border-t border-white/[0.08]">
          {GENERATION_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs transition-all ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-white font-bold scale-[1.02]'
                    : 'text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="truncate">{step.title}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
