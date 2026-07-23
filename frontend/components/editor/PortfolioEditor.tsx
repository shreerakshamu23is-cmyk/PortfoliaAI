'use client';

import React, { useState } from 'react';
import {
  User, Code2, Briefcase, FolderGit2, GraduationCap, Award, Palette, Plus, Trash2, Check, Sparkles, Edit3, MessageSquare
} from 'lucide-react';
import { PortfolioData, ThemeType } from '@/types/portfolio';

interface PortfolioEditorProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
  selectedTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const THEME_OPTIONS: { id: ThemeType; name: string; desc: string; tag: string }[] = [
  { id: 'modern-glass', name: 'Neo Minimal', desc: 'Luminous translucent glass cards, neon accents', tag: 'Software Engineer' },
  { id: 'executive-slate', name: 'Executive Slate', desc: 'Classic serif typography, authoritative gold accents', tag: 'Architect / Lead' },
  { id: 'cyberpunk-tech', name: 'Cyber Tech', desc: 'Pure black terminal aesthetic, cyan/emerald code', tag: 'DevOps / Backend' },
  { id: 'minimal-elegance', name: 'Apple Style', desc: 'Crisp minimal whitespace, refined typography', tag: 'UI / Product' },
  { id: 'dark-prism', name: 'Aurora ML', desc: 'Prismatic gradient backdrop, stat cards for AI/ML', tag: 'ML / Data Science' },
  { id: 'cyber-security', name: 'Cybersecurity', desc: 'Dark security matrix layout, red audit metrics', tag: 'Security / Audit' },
  { id: 'data-scientist', name: 'Data Scientist', desc: 'Analytics dashboard grid, metric charts', tag: 'Data Science' },
];

export const PortfolioEditor: React.FC<PortfolioEditorProps> = ({
  data,
  onChange,
  selectedTheme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'custom' | 'theme'>('profile');
  const [customInputText, setCustomInputText] = useState('');
  const [customTargetSection, setCustomTargetSection] = useState<'about' | 'headline' | 'skills' | 'experience' | 'projects'>('about');

  const updateField = (field: keyof PortfolioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field: string, value: string) => {
    onChange({
      ...data,
      contact: {
        ...data.contact,
        [field]: value
      }
    });
  };

  const handleAddSkillCategory = () => {
    const newSkills = [...data.skills, { category: 'New Skill Category', skills: ['Skill 1', 'Skill 2'] }];
    updateField('skills', newSkills);
  };

  const handleAddExperience = () => {
    const newExp = [
      ...data.experience,
      {
        id: `exp-${Date.now()}`,
        title: 'Software Engineer / Role Title',
        company: 'Company / Organization',
        location: 'City, ST',
        period: '2023 - Present',
        description: ['Key responsibilities and achievements.'],
        technologies: ['React', 'Python']
      }
    ];
    updateField('experience', newExp);
  };

  const handleAddProject = () => {
    const newProjects = [
      ...data.projects,
      {
        id: `proj-${Date.now()}`,
        title: 'New Project Title',
        description: 'Detailed description of the project, features, and impact.',
        highlights: ['Key achievement or feature'],
        technologies: ['TypeScript', 'FastAPI'],
        github_url: '',
        live_url: ''
      }
    ];
    updateField('projects', newProjects);
  };

  const handleAddEducation = () => {
    const newEdu = [
      ...data.education,
      {
        id: `edu-${Date.now()}`,
        degree: 'Degree / Field of Study',
        institution: 'University / Institute Name',
        location: '',
        year: '2020 - 2024',
        details: ''
      }
    ];
    updateField('education', newEdu);
  };

  const handleAddCertification = () => {
    const newCert = [
      ...(data.certifications || []),
      {
        id: `cert-${Date.now()}`,
        name: 'Certification Title',
        issuer: 'Issuing Organization',
        year: '2024'
      }
    ];
    updateField('certifications', newCert);
  };

  const handleApplyCustomText = () => {
    if (!customInputText.trim()) return;

    if (customTargetSection === 'about') {
      updateField('about', customInputText.trim());
    } else if (customTargetSection === 'headline') {
      updateField('hero_subheadline', customInputText.trim());
    } else if (customTargetSection === 'skills') {
      const newSkills = [...data.skills, { category: 'Custom Skills', skills: customInputText.split(',').map(s => s.trim()).filter(Boolean) }];
      updateField('skills', newSkills);
    } else if (customTargetSection === 'experience') {
      const newExp = [
        ...data.experience,
        {
          id: `exp-${Date.now()}`,
          title: 'Custom Experience',
          company: 'Direct Custom Addition',
          location: '',
          period: 'Present',
          description: [customInputText.trim()],
          technologies: []
        }
      ];
      updateField('experience', newExp);
    } else if (customTargetSection === 'projects') {
      const newProjects = [
        ...data.projects,
        {
          id: `proj-${Date.now()}`,
          title: 'Custom Highlighted Project',
          description: customInputText.trim(),
          highlights: [],
          technologies: [],
          github_url: '',
          live_url: ''
        }
      ];
      updateField('projects', newProjects);
    }
    setCustomInputText('');
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Editor Tab Navigation */}
      <div className="flex items-center gap-1 p-2 border-b border-white/[0.08] overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'skills', label: 'Skills', icon: Code2 },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'certifications', label: 'Certs', icon: Award },
          { id: 'custom', label: 'Write Custom', icon: Edit3, isAccent: true },
          { id: 'theme', label: 'Themes', icon: Palette, isAccent: true },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? t.isAccent ? 'bg-purple-600 text-white shadow' : 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Editor Drawer Body */}
      <div className="p-5 overflow-y-auto max-h-[600px] space-y-6">

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <User className="w-4 h-4 text-indigo-400" /> Basic Bio & Headlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Professional Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Hero Main Greeting Headline</label>
                <input
                  type="text"
                  value={data.hero_headline || ''}
                  onChange={(e) => updateField('hero_headline', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Hero Subheadline</label>
                <input
                  type="text"
                  value={data.hero_subheadline || ''}
                  onChange={(e) => updateField('hero_subheadline', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">About Me / Executive Summary</label>
              <textarea
                rows={4}
                value={data.about}
                onChange={(e) => updateField('about', e.target.value)}
                className="input-dark mt-1 text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={data.contact.email || ''}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={data.contact.phone || ''}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">GitHub Profile URL</label>
                <input
                  type="text"
                  value={data.contact.github || ''}
                  onChange={(e) => updateContact('github', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={data.contact.linkedin || ''}
                  onChange={(e) => updateContact('linkedin', e.target.value)}
                  className="input-dark mt-1 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" /> Technical Skill Categories
              </h3>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-indigo-400"
              >
                <Plus className="w-3 h-3" /> Add Category
              </button>
            </div>

            {data.skills.map((cat, catIdx) => (
              <div key={catIdx} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => {
                      const newSkills = [...data.skills];
                      newSkills[catIdx].category = e.target.value;
                      updateField('skills', newSkills);
                    }}
                    className="font-bold text-xs text-indigo-400 bg-transparent px-2 py-1 rounded border border-indigo-500/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = data.skills.filter((_, idx) => idx !== catIdx);
                      updateField('skills', newSkills);
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={cat.skills.join(', ')}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      const newSkills = [...data.skills];
                      newSkills[catIdx].skills = list;
                      updateField('skills', newSkills);
                    }}
                    className="input-dark mt-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" /> Work Experience
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-purple-400"
              >
                <Plus className="w-3 h-3" /> Add Experience
              </button>
            </div>

            {data.experience.map((exp, expIdx) => (
              <div key={expIdx} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Experience #{expIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newExp = data.experience.filter((_, idx) => idx !== expIdx);
                      updateField('experience', newExp);
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Role Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...data.experience];
                        newExp[expIdx].title = e.target.value;
                        updateField('experience', newExp);
                      }}
                      className="input-dark mt-1 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...data.experience];
                        newExp[expIdx].company = e.target.value;
                        updateField('experience', newExp);
                      }}
                      className="input-dark mt-1 text-xs text-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Period / Dates</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[expIdx].period = e.target.value;
                      updateField('experience', newExp);
                    }}
                    className="input-dark mt-1 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Description Bullets (1 per line)</label>
                  <textarea
                    rows={3}
                    value={exp.description ? exp.description.join('\n') : ''}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[expIdx].description = e.target.value.split('\n').filter(Boolean);
                      updateField('experience', newExp);
                    }}
                    className="input-dark mt-1 text-xs resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-emerald-400" /> Featured Projects
              </h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-emerald-400"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            {data.projects.map((proj, pIdx) => (
              <div key={pIdx} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400">Project Title</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newProjects = data.projects.filter((_, idx) => idx !== pIdx);
                      updateField('projects', newProjects);
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => {
                    const newProj = [...data.projects];
                    newProj[pIdx].title = e.target.value;
                    updateField('projects', newProj);
                  }}
                  className="input-dark font-bold text-xs"
                />

                <div>
                  <label className="text-[10px] text-slate-400">Project Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[pIdx].description = e.target.value;
                      updateField('projects', newProj);
                    }}
                    className="input-dark mt-1 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Technologies (Comma Separated)</label>
                  <input
                    type="text"
                    value={proj.technologies ? proj.technologies.join(', ') : ''}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      const newProj = [...data.projects];
                      newProj[pIdx].technologies = list;
                      updateField('projects', newProj);
                    }}
                    className="input-dark mt-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" /> Education Background
              </h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-cyan-400"
              >
                <Plus className="w-3 h-3" /> Add Education
              </button>
            </div>

            {data.education.map((edu, eduIdx) => (
              <div key={eduIdx} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Education #{eduIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu = data.education.filter((_, idx) => idx !== eduIdx);
                      updateField('education', newEdu);
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Degree / Qualification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...data.education];
                        newEdu[eduIdx].degree = e.target.value;
                        updateField('education', newEdu);
                      }}
                      className="input-dark mt-1 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...data.education];
                        newEdu[eduIdx].institution = e.target.value;
                        updateField('education', newEdu);
                      }}
                      className="input-dark mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Year / Duration</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[eduIdx].year = e.target.value;
                      updateField('education', newEdu);
                    }}
                    className="input-dark mt-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Certifications & Licenses
              </h3>
              <button
                type="button"
                onClick={handleAddCertification}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-amber-400"
              >
                <Plus className="w-3 h-3" /> Add Certification
              </button>
            </div>

            {(data.certifications || []).map((cert, cIdx) => (
              <div key={cIdx} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Certification #{cIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newCerts = (data.certifications || []).filter((_, idx) => idx !== cIdx);
                      updateField('certifications', newCerts);
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Certification Title</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...(data.certifications || [])];
                        newCerts[cIdx].name = e.target.value;
                        updateField('certifications', newCerts);
                      }}
                      className="input-dark mt-1 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Issuer / Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const newCerts = [...(data.certifications || [])];
                        newCerts[cIdx].issuer = e.target.value;
                        updateField('certifications', newCerts);
                      }}
                      className="input-dark mt-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: WRITE CUSTOM / DIRECT EDIT */}
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Edit3 className="w-4 h-4 text-purple-400" /> Write Custom Text & Direct Changes
            </h3>

            <p className="text-xs text-slate-400">
              Type or paste what you want to add or update in your portfolio, choose the target section, and click apply.
            </p>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Target Section</label>
              <select
                value={customTargetSection}
                onChange={(e) => setCustomTargetSection(e.target.value as any)}
                className="input-dark mt-1 text-xs bg-slate-900 text-white"
              >
                <option value="about">About / Bio Section</option>
                <option value="headline">Hero Subheadline</option>
                <option value="skills">Add Skills (Comma Separated)</option>
                <option value="experience">Add Experience Note</option>
                <option value="projects">Add Project Note</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Write What You Want Here</label>
              <textarea
                rows={5}
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="e.g. Add 5+ years of experience in Python, AWS Cloud Architect, and led cross-functional team of 10 developers..."
                className="input-dark mt-1 text-xs resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCustomText}
              disabled={!customInputText.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Apply Custom Text To Portfolio
            </button>
          </div>
        )}

        {/* TAB 8: THEMES */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/[0.08] pb-2">
              7 Profession-Aware Portfolio Themes
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onThemeChange(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedTheme === t.id
                      ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                      : 'hover:border-white/20'
                  }`}
                  style={selectedTheme !== t.id ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' } : {}}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{t.name}</h4>
                      <span className="badge badge-purple text-[9px] py-0.5">{t.tag}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
                  </div>
                  {selectedTheme === t.id && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
