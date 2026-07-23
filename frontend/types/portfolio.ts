export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id?: string;
  title: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  featured?: boolean;
  metrics?: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  year: string;
  details?: string;
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  year?: string;
  credential_url?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  about: string;
  contact: ContactInfo;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  hero_headline?: string;
  hero_subheadline?: string;
}

export interface Customizations {
  primaryColor?: string;
  fontFamily?: string;
  showCertifications?: boolean;
  showEducation?: boolean;
  sectionOrder?: string[];
}

export type ThemeType = 
  | 'modern-glass' 
  | 'executive-slate' 
  | 'cyberpunk-tech' 
  | 'minimal-elegance' 
  | 'dark-prism'
  | 'cyber-security'
  | 'data-scientist';

export interface Portfolio {
  id: string;
  user_id?: number;
  title: string;
  theme: ThemeType;
  data: PortfolioData;
  customizations?: Customizations;
  created_at?: string;
  updated_at?: string;
}

export interface ResumeUploadResponse {
  raw_text: string;
  portfolio_data: PortfolioData;
  ai_enhanced: boolean;
}
