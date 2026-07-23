'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, MapPin, Globe, ExternalLink,
  Sparkles, Briefcase, GraduationCap, Award, Code2, FolderGit2,
  ChevronRight, Shield, ShieldCheck, Terminal, Database, Cpu, Activity,
  BarChart3, Layers, Lock, CheckCircle2, Star, Zap
} from 'lucide-react';
import { PortfolioData, ThemeType, Customizations } from '@/types/portfolio';

interface ThemeProps {
  data: PortfolioData;
  customizations?: Customizations;
  previewMode?: boolean;
}

export const PortfolioRenderer: React.FC<ThemeProps & { theme: ThemeType }> = ({
  data,
  customizations,
  previewMode = false,
  theme
}) => {
  switch (theme) {
    case 'executive-slate':
      return <ExecutiveSlateTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'cyberpunk-tech':
      return <CyberpunkTechTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'minimal-elegance':
      return <MinimalEleganceTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'dark-prism':
      return <AuroraMLTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'cyber-security':
      return <CyberSecurityTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'data-scientist':
      return <DataScientistTheme data={data} customizations={customizations} previewMode={previewMode} />;
    case 'modern-glass':
    default:
      return <ModernGlassTheme data={data} customizations={customizations} previewMode={previewMode} />;
  }
};

// ----------------------------------------------------
// THEME 1: Modern Glassmorphism (Software Engineers)
// ----------------------------------------------------
const ModernGlassTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-hidden">
      {/* Luminous background blobs with subtle pulse animation */}
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.2, 0.15] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 relative z-10">

        {/* HERO */}
        <section className="pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Software Engineer Portfolio
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I&apos;m <span className="text-gradient">{data.name}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg sm:text-xl font-medium text-indigo-300">
              {data.title}
            </motion.p>

            {data.about && (
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {data.about}
              </motion.p>
            )}

            {/* Social Links */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {data.contact.email && (
                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} href={`mailto:${data.contact.email}`} className="btn-primary text-xs py-2 px-4">
                  <Mail className="w-4 h-4" /> Get in Touch
                </motion.a>
              )}
              {data.contact.github && (
                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} href={data.contact.github.startsWith('http') ? data.contact.github : `https://${data.contact.github}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-4">
                  <Github className="w-4 h-4" /> GitHub
                </motion.a>
              )}
              {data.contact.linkedin && (
                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} href={data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-4">
                  <Linkedin className="w-4 h-4 text-indigo-400" /> LinkedIn
                </motion.a>
              )}
            </motion.div>
          </div>
        </section>

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Technical Expertise</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.skills.map((cat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass-hover rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Work Experience</h2>
            </motion.div>

            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <motion.div key={exp.id || idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                  className="glass-hover rounded-2xl p-7 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                      {exp.company && <p className="text-sm text-indigo-400 font-medium">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>}
                    </div>
                    {exp.period && <span className="badge badge-indigo self-start sm:self-auto text-[11px]">{exp.period}</span>}
                  </div>

                  {exp.description && exp.description.length > 0 && (
                    <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className="text-indigo-400 mt-1">▸</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                      {exp.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[11px] px-2.5 py-0.5 rounded font-mono" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <section className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Featured Projects</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((proj, idx) => (
                <motion.div key={proj.id || idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass-hover rounded-2xl p-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {proj.description && <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>}

                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {proj.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <Sparkles className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded font-mono text-slate-400" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Education & Academic Background</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.education.map((edu, idx) => (
                <motion.div key={edu.id || idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass-hover rounded-2xl p-7 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                    {edu.year && <span className="badge badge-emerald self-start sm:self-auto text-[11px]">{edu.year}</span>}
                  </div>
                  {edu.institution && <p className="text-xs font-semibold text-emerald-400">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>}
                  {edu.details && <p className="text-xs text-slate-300 leading-relaxed">{edu.details}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Certifications & Achievements</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.certifications.map((cert, idx) => (
                <motion.div key={cert.id || idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className="glass-hover rounded-2xl p-5 space-y-2">
                  <h3 className="text-xs font-bold text-white leading-snug">{cert.name}</h3>
                  {cert.issuer && <p className="text-[11px] font-medium text-amber-400">{cert.issuer}</p>}
                  {cert.year && <span className="text-[10px] text-slate-400 font-mono block">{cert.year}</span>}
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 2: Executive Slate (Senior Leads / Architects)
// ----------------------------------------------------
const ExecutiveSlateTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-200 font-serif p-8 sm:p-14">
      <div className="max-w-4xl mx-auto space-y-16 border-l-2 border-amber-500/30 pl-8 sm:pl-12">
        <motion.header initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-4 font-sans">
          <div className="badge badge-amber inline-flex">
            <Award className="w-3.5 h-3.5" /> Executive Portfolio
          </div>
          <h1 className="text-5xl font-extrabold text-white font-serif tracking-tight">{data.name}</h1>
          <p className="text-xl text-amber-400 font-light">{data.title}</p>
          {data.about && <p className="text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">{data.about}</p>}
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
            {data.contact.email && <span>Email: {data.contact.email}</span>}
            {data.contact.phone && <span>• {data.contact.phone}</span>}
            {data.contact.location && <span>• {data.contact.location}</span>}
          </div>
        </motion.header>

        {data.experience && data.experience.length > 0 && (
          <section className="space-y-6 font-sans">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/[0.08] pb-2">Leadership & Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-white">{exp.title} {exp.company ? `— ${exp.company}` : ''}</h3>
                    {exp.period && <span className="text-xs text-slate-400 font-mono">{exp.period}</span>}
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
                      {exp.description.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="space-y-4 font-sans">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/[0.08] pb-2">Key Initiatives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.projects.map((p, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-xl space-y-2 transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  {p.description && <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}
        {data.education && data.education.length > 0 && (
          <section className="space-y-4 font-sans">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/[0.08] pb-2">Education & Academic Qualifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.education.map((edu, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                    {edu.year && <span className="text-xs text-amber-400 font-mono">{edu.year}</span>}
                  </div>
                  {edu.institution && <p className="text-xs text-slate-400 font-medium">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>}
                  {edu.details && <p className="text-xs text-slate-300 leading-relaxed">{edu.details}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-4 font-sans">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/[0.08] pb-2">Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.certifications.map((cert, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                  className="p-4 rounded-xl space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-xs font-bold text-white">{cert.name}</h3>
                  {cert.issuer && <p className="text-[11px] text-amber-400">{cert.issuer}</p>}
                  {cert.year && <span className="text-[10px] text-slate-400 font-mono block">{cert.year}</span>}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 3: Cyberpunk Tech (Backend / DevOps)
// ----------------------------------------------------
const CyberpunkTechTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-black text-cyan-400 font-mono p-6 sm:p-12 border-t-4 border-cyan-500">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="p-6 rounded-xl space-y-3 shadow-lg shadow-cyan-500/10" style={{ background: '#070d18', border: '1px solid rgba(6,182,212,0.4)' }}>
          <p className="text-xs text-emerald-400">$ cat sys_profile.json</p>
          <h1 className="text-4xl font-bold text-white">&gt; {data.name}</h1>
          <p className="text-sm text-cyan-300">{data.title}</p>
          {data.about && <p className="text-xs text-slate-300 mt-4 leading-relaxed font-sans">{data.about}</p>}
        </motion.div>

        {data.skills && data.skills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-2">// Technical_Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.skills.map((cat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded text-xs space-y-2" style={{ background: '#070d18', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-cyan-400 font-bold"># {cat.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s, sIdx) => (
                      <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-2">// Experience_Log</h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="p-5 rounded space-y-2" style={{ background: '#070d18', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-between text-xs text-white font-bold">
                    <span>[ROLE]: {exp.title} {exp.company ? `@ ${exp.company}` : ''}</span>
                    <span className="text-cyan-400">{exp.period}</span>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="text-xs text-slate-400 space-y-1 font-sans">
                      {exp.description.map((d, dIdx) => <li key={dIdx}>- {d}</li>)}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-2">// Project_Repository</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((p, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="p-5 rounded space-y-2" style={{ background: '#070d18', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">&gt; {p.title}</h3>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
                        Repo
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-xs text-slate-400 font-sans leading-relaxed">{p.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {data.education && data.education.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-2">// Academic_Qualifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.education.map((edu, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="p-5 rounded space-y-2" style={{ background: '#070d18', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-between text-xs text-white font-bold">
                    <span>[DEGREE]: {edu.degree}</span>
                    <span className="text-cyan-400">{edu.year}</span>
                  </div>
                  {edu.institution && <p className="text-xs text-cyan-300">[INST]: {edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>}
                  {edu.details && <p className="text-xs text-slate-400 font-sans">{edu.details}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-2">// Verified_Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.certifications.map((cert, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                  className="p-4 rounded text-xs space-y-1" style={{ background: '#070d18', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <p className="text-white font-bold">&gt; {cert.name}</p>
                  {cert.issuer && <p className="text-cyan-400">{cert.issuer}</p>}
                  {cert.year && <span className="text-[10px] text-slate-500">{cert.year}</span>}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 4: Apple Style (UI Designers / Product Engineers)
// ----------------------------------------------------
const MinimalEleganceTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] text-slate-900 font-sans p-8 sm:p-16">
      <div className="max-w-3xl mx-auto space-y-16">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest">Product & UI Engineer</span>
          <h1 className="text-5xl font-light tracking-tight text-slate-950">{data.name}</h1>
          <p className="text-lg text-indigo-600 font-medium">{data.title}</p>
          {data.about && <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{data.about}</p>}
        </motion.header>

        {data.projects && data.projects.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-widest">Selected Work</h2>
            <div className="space-y-6">
              {data.projects.map((p, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3 hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                  {p.description && <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 5: Aurora (ML / AI / Data Science Engineers)
// ----------------------------------------------------
const AuroraMLTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 p-8 sm:p-14 font-sans relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        <motion.header initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl space-y-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.15) 50%, rgba(236,72,153,0.1) 100%)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <div className="badge badge-purple inline-flex">
            <Cpu className="w-3.5 h-3.5" /> AI & Machine Learning Engineer
          </div>
          <h1 className="text-5xl font-extrabold text-white text-gradient">{data.name}</h1>
          <p className="text-xl font-semibold text-purple-300">{data.title}</p>
          {data.about && <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{data.about}</p>}
        </motion.header>

        {data.experience && data.experience.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.experience.map((exp, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="p-7 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {exp.period && <span className="badge badge-purple text-[10px]">{exp.period}</span>}
                <h3 className="text-base font-bold text-white">{exp.title}</h3>
                {exp.company && <p className="text-xs text-purple-400">{exp.company}</p>}
                {exp.description && (
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    {exp.description.map((d, dIdx) => <li key={dIdx}>• {d}</li>)}
                  </ul>
                )}
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 6: Cybersecurity Theme (Dark mode, Neon red/cyan)
// ----------------------------------------------------
const CyberSecurityTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 p-8 sm:p-14 font-mono">
      <div className="max-w-4xl mx-auto space-y-14">
        <motion.header initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl space-y-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
            <Lock className="w-4 h-4" /> Cybersecurity & Auditing Specialist
          </div>
          <h1 className="text-4xl font-extrabold text-white">{data.name}</h1>
          <p className="text-sm text-red-400 font-semibold">{data.title}</p>
          {data.about && <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">{data.about}</p>}
        </motion.header>

        {data.experience && data.experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-red-500/20 pb-2">// Security_Audit_Log</h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-white">{exp.title} {exp.company ? <span className="text-red-400">@ {exp.company}</span> : ''}</h3>
                    {exp.period && <span className="text-xs text-slate-500">{exp.period}</span>}
                  </div>
                  {exp.description && (
                    <ul className="text-xs text-slate-300 space-y-1 font-sans">
                      {exp.description.map((d, dIdx) => <li key={dIdx}>▸ {d}</li>)}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// THEME 7: Data Scientist Theme (Analytics Grid)
// ----------------------------------------------------
const DataScientistTheme: React.FC<ThemeProps> = ({ data }) => {
  return (
    <div className="w-full min-h-screen bg-[#070c18] text-slate-100 p-8 sm:p-14 font-sans">
      <div className="max-w-5xl mx-auto space-y-14">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl space-y-4" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.25)' }}>
          <div className="badge badge-cyan inline-flex">
            <BarChart3 className="w-3.5 h-3.5" /> Data Scientist & Analytics Lead
          </div>
          <h1 className="text-4xl font-extrabold text-white">{data.name}</h1>
          <p className="text-base text-cyan-400 font-medium">{data.title}</p>
          {data.about && <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{data.about}</p>}
        </motion.header>

        {data.projects && data.projects.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.map((proj, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Activity className="w-4 h-4" /> Data Analytics Project
                </div>
                <h3 className="text-base font-bold text-white">{proj.title}</h3>
                {proj.description && <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>}
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
