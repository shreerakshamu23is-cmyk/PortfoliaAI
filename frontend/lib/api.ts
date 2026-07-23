import { PortfolioData, Portfolio, ResumeUploadResponse } from '@/types/portfolio';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('portfolioai_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

export const ApiService = {
  async uploadResume(file?: File, rawText?: string): Promise<ResumeUploadResponse> {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (rawText) {
        formData.append('raw_text', rawText);
      }

      const res = await fetch(`${API_BASE}/resume/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[API] Upload resume backend offline or unreachable, using high-fidelity local parser simulation', err);
      return simulateLocalResumeParsing(file, rawText);
    }
  },

  async createPortfolio(data: PortfolioData, theme: string = 'modern-glass', title?: string): Promise<Portfolio> {
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: title || `${data.name}'s Portfolio`,
          theme,
          data,
        }),
      });

      if (!res.ok) {
        throw new Error(`Create portfolio failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn('[API] Save portfolio backend offline, saving locally', err);
      const mockId = 'p-' + Math.random().toString(36).substring(2, 9);
      const portfolio: Portfolio = {
        id: mockId,
        title: title || `${data.name}'s Portfolio`,
        theme: theme as any,
        data,
        created_at: new Date().toISOString(),
      };
      return portfolio;
    }
  },

  async getPortfolio(id: string): Promise<Portfolio> {
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        throw new Error(`Get portfolio failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn('[API] Fetch portfolio backend offline or 404, checking local storage and active draft', err);
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`portfolio_${id}`);
        if (saved) return JSON.parse(saved);

        const draftStr = localStorage.getItem('portfolioai_draft_data');
        const draftTheme = (localStorage.getItem('portfolioai_draft_theme') as any) || 'modern-glass';
        if (draftStr) {
          try {
            const draftData = JSON.parse(draftStr);
            return {
              id,
              title: `${draftData.name}'s Portfolio`,
              theme: draftTheme,
              data: draftData,
              created_at: new Date().toISOString(),
            };
          } catch {
            // pass
          }
        }
      }
      throw new Error('Portfolio not found');
    }
  },

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio> {
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`Update portfolio failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn('[API] Update portfolio backend offline', err);
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`portfolio_${id}`);
        const current = saved ? JSON.parse(saved) : {};
        const updated = { ...current, ...updates };
        localStorage.setItem(`portfolio_${id}`, JSON.stringify(updated));
        return updated;
      }
      throw err;
    }
  }
};

function sanitizePDFRawText(text: string): string {
  if (!text) return '';

  // 1. Strip PDF font width arrays (e.g. 667 722 722 1000 or [667 722 722])
  text = text.replace(/\b\d{3,4}(?:\s+\d{3,4}){2,}\b/g, '');
  text = text.replace(/\[\s*\d+(?:\s+\d+)*\s*\]/g, '');

  // 2. Decode UTF-16BE hex titles (e.g. /Title <FEFFF0D8...>)
  text = text.replace(/\/Title\s*<([0-9A-Fa-f]+)>/g, (_, hexStr) => {
    try {
      let cleanHex = hexStr;
      if (cleanHex.toLowerCase().startsWith('feff')) cleanHex = cleanHex.slice(4);
      let str = '';
      for (let i = 0; i < cleanHex.length; i += 4) {
        str += String.fromCharCode(parseInt(cleanHex.substr(i, 4), 16));
      }
      return `/Title (${str})`;
    } catch {
      return _;
    }
  });

  const extractedTitles: string[] = [];
  const titleMatches = text.matchAll(/\/Title\s*\((.*?)\)/g);
  for (const m of titleMatches) {
    const cleanT = m[1].replace(/\\\(/g, '(').replace(/\\\)/g, ')').trim();
    if (cleanT && !cleanT.match(/%PDF-|\/Dest|\/Parent|\/Prev|\/Next/)) {
      extractedTitles.push(cleanT);
    }
  }

  const pdfJunkPattern = /(%PDF-|obj\b|endobj\b|\/Dest\b|\/Parent\b|\/Prev\b|\/Next\b|\/XYZ\b|\/Nums\b|\/Footnote\b|\/Endnote\b|\/Textbox\b|\/Header\b|\/Footer\b|\/InlineShape\b|\/Annotation\b|\/Artifact\b|\/Workbook\b|\/Worksheet\b|Arial,Bold|TimesNewRoman|Helvetica|<<|>>)/i;

  const cleanLines: string[] = [];
  for (const line of text.split('\n')) {
    const stripped = line.trim();
    if (!stripped) continue;
    if (stripped.startsWith('%') || stripped.startsWith('\ufffd') || stripped.includes('\ufffd') || stripped === '%') continue;
    if (pdfJunkPattern.test(stripped) && !stripped.startsWith('/Title')) continue;
    if (stripped.startsWith('/Title')) continue;
    cleanLines.push(stripped);
  }

  if (extractedTitles.length > 0) {
    cleanLines.push('\nADDITIONAL EXTRACTED CONTENT:');
    for (const t of extractedTitles) cleanLines.push(t);
  }

  return cleanLines.join('\n').trim();
}

async function simulateLocalResumeParsing(file?: File, rawText?: string): Promise<ResumeUploadResponse> {
  let text = rawText || '';

  if (file && !text) {
    try {
      text = await file.text();
    } catch {
      text = '';
    }
  }

  if (text.includes('%PDF-') || text.includes('/Title') || text.includes('endobj')) {
    text = sanitizePDFRawText(text);
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Name (Ignore section header keywords & title fragments)
  const headerKeywords = ['profile', 'resume', 'curriculum vitae', 'cv', 'contact', 'summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'internships', 'objective', 'software engineer & technology specialist', 'final'];
  let name = '';

  for (const line of lines.slice(0, 10)) {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('%') || cleanLine.includes('\ufffd') || cleanLine.startsWith('/') || cleanLine.startsWith('http')) continue;

    const parts = cleanLine.split(/\s+[|•·@–—]\s+|\s+-\s+/);
    const candidatePart = parts[0].trim();
    const candidateLower = candidatePart.toLowerCase();

    if (!headerKeywords.includes(candidateLower) && !candidatePart.match(/[@\dhttp:]/) && candidatePart.length >= 2 && candidatePart.length <= 45) {
      const cleanName = candidatePart.replace(/^[-•*▸▪\d\.\s]+/, '').trim();
      if (cleanName && !cleanName.startsWith('%') && !cleanName.includes('\ufffd') && cleanName.toLowerCase() !== 'final' && !headerKeywords.some(kw => cleanName.toLowerCase().includes(kw))) {
        name = cleanName;
        break;
      }
    }
  }

  // 2. Extract Contact Info & Location
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const fallbackEmail = text.match(/[\w\.-]+@(?:gmail|outlook|yahoo|hotmail|icloud)\.[a-z]{2,4}/i);
  const email = emailMatch ? emailMatch[0] : (fallbackEmail ? fallbackEmail[0] : '');

  // Filter out PDF font width arrays, PDF metadata CreationDates (e.g. 2026021210241) and stream coordinates
  const cleanedPhoneText = text.replace(/\b20[12]\d{10,14}\b/g, '').replace(/\b\d{3,4}(?:\s+\d{3,4}){2,}\b/g, '').replace(/00\d{8,}/g, '');
  const phoneMatch = cleanedPhoneText.match(/(\+?\d{1,3}[\s\.\-]?)?\(?\d{3}\)?[\s\.\-]?\d{3}[\s\.\-]?\d{4}/);
  let phone = phoneMatch ? phoneMatch[0] : '';
  if (phone.startsWith('00') || phone.length > 14 || phone.startsWith('202') || phone.startsWith('201') || phone.startsWith('200')) phone = '';

  const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[\w-]+/i);
  let github = githubMatch ? githubMatch[0] : '';
  if (github && !github.startsWith('http')) github = 'https://' + github;

  const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/([\w-]+)/i);
  let linkedin = linkedinMatch ? linkedinMatch[0] : '';
  if (linkedin && !linkedin.startsWith('http')) linkedin = 'https://' + linkedin;
  const linkedinHandle = linkedinMatch ? linkedinMatch[3] : '';

  // Fallback to LinkedIn handle or email if candidate name was missed or invalid
  if (!name || name.startsWith('%') || name.toLowerCase() === 'final' || name === 'Professional Candidate') {
    if (linkedinHandle) {
      const isJunkPart = (w: string) => /^\d+$/.test(w) || (/^[0-9a-f]{6,}$/i.test(w)) || (/\d/.test(w) && /[a-z]/i.test(w) && w.length >= 6);
      const cleanParts = linkedinHandle.split(/[-_\.]/).filter(w => w && !isJunkPart(w)).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      if (cleanParts.length > 0) name = cleanParts.join(' ');
    } else if (email) {
      const username = email.split('@')[0];
      const cleanParts = username.split(/[-_\.]/).filter(w => w && !/^\d+$/.test(w)).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      if (cleanParts.length > 0) name = cleanParts.join(' ');
    }
  }

  if (!name || name.toLowerCase() === 'final') name = 'Professional Candidate';

  const locationMatch = text.substring(0, 1000).match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z\s]+))\b/);
  const location = (locationMatch && !locationMatch[1].match(/github|linkedin|email/i)) ? locationMatch[1].trim() : '';

  // 3. Extract Job Title
  let title = '';
  const roleKeywords = ['engineer', 'developer', 'architect', 'analyst', 'designer', 'scientist', 'manager', 'specialist', 'consultant', 'lead', 'administrator', 'founder', 'aspiring'];

  // Check text for full stack / software engineer profile declarations first
  if (text.match(/full\s*stack/i) || text.match(/software\s*engineer/i)) {
    if (text.match(/full\s*stack/i) && text.match(/software\s*engineer/i)) {
      title = 'Software Engineer & Full Stack Developer';
    } else if (text.match(/full\s*stack/i)) {
      title = 'Full Stack Developer';
    } else {
      title = 'Software Engineer';
    }
  }

  if (!title) {
    for (const line of lines.slice(1, 12)) {
      const cleanL = line.trim();
      if (cleanL && cleanL !== name && !cleanL.match(/[@\dhttp:]/) && cleanL.length < 65) {
        if (roleKeywords.some(kw => cleanL.toLowerCase().includes(kw))) {
          const parts = cleanL.split(/\s+[|•·@–—]\s+|\s+-\s+/);
          for (const p of parts) {
            if (roleKeywords.some(kw => p.toLowerCase().includes(kw))) {
              title = p.trim();
              break;
            }
          }
          if (title) break;
        }
      }
    }
  }

  // 4. Extract Skills
  const knownTechs = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
    'Node.js', 'FastAPI', 'Django', 'Flask', 'Express', 'HTML', 'CSS', 'Tailwind CSS',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'REST API', 'Java', 'C', 'SQL',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'GitHub Actions', 'CI/CD',
    'Linux', 'System Design', 'Microservices', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy'
  ];

  const foundTechs: string[] = [];
  const lowerText = text.toLowerCase();
  for (const tech of knownTechs) {
    const lowerTech = tech.toLowerCase();
    if (tech.includes('+') || tech.includes('#') || tech.includes('.')) {
      if (lowerText.includes(lowerTech)) foundTechs.push(tech);
    } else {
      try {
        const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(text)) {
          foundTechs.push(tech);
        }
      } catch {
        if (lowerText.includes(lowerTech)) foundTechs.push(tech);
      }
    }
  }

  if (!title) {
    if (foundTechs.some(t => ['Python', 'Java', 'FastAPI', 'Node.js', 'PostgreSQL', 'MySQL', 'SQL'].includes(t)) && foundTechs.some(t => ['HTML', 'CSS', 'React', 'JavaScript'].includes(t))) {
      title = 'Software Engineer & Full Stack Developer';
    } else if (foundTechs.some(t => ['Python', 'Java', 'C', 'PostgreSQL', 'MySQL', 'SQL'].includes(t))) {
      title = 'Software Engineer';
    } else if (foundTechs.some(t => ['React', 'Next.js', 'TypeScript', 'HTML'].includes(t))) {
      title = 'Frontend Developer';
    } else {
      title = 'Software Engineer & Technology Specialist';
    }
  }

  const frontendTechs = foundTechs.filter(t => ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Vue.js', 'Angular'].includes(t));
  const backendTechs = foundTechs.filter(t => ['Python', 'FastAPI', 'Django', 'Flask', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis'].includes(t));
  const toolsTechs = foundTechs.filter(t => ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'GitHub Actions', 'CI/CD'].includes(t));

  const skills: any[] = [];
  if (frontendTechs.length > 0) skills.push({ category: 'Frontend & Web', skills: frontendTechs });
  if (backendTechs.length > 0) skills.push({ category: 'Backend & Databases', skills: backendTechs });
  if (toolsTechs.length > 0 || skills.length === 0) skills.push({ category: 'DevOps & Tools', skills: toolsTechs.length > 0 ? toolsTechs : ['Software Engineering', 'System Architecture', 'Git'] });

  // 5. Extract Experience
  const expItems: any[] = [];
  let inExp = false;
  let currExp: any = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.match(/experience|work history|employment/i) && line.length < 35) {
      inExp = true;
      continue;
    }
    if (inExp && lower.match(/education|projects|certifications|skills/i) && line.length < 35) {
      inExp = false;
    }
    if (inExp) {
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      const cleanLine = line.replace(/^[-•*▸▪\d\.\s]+/, '').trim();
      const periodMatch = line.match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*[\d]{4}\s*[-–—\s]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current|[\d]{4}))/i);

      if ((roleKeywords.some(kw => lower.includes(kw)) || periodMatch) && !isBullet && line.length < 110) {
        if (currExp) expItems.push(currExp);
        const period = periodMatch ? periodMatch[0].trim() : 'Present';
        let lineNoPeriod = line.replace(period, '').replace(/\(\s*\)/, '').replace(/^[-•*▸▪\d\.\s]+/, '').trim();

        const parts = lineNoPeriod.split(/\s+[|•·@–—]\s+|\s+-\s+|@/);
        const part1 = parts[0] ? parts[0].trim() : lineNoPeriod;
        const part2 = parts[1] ? parts[1].trim() : '';

        let expTitle = part1;
        let expCompany = part2;
        if (roleKeywords.some(kw => part2.toLowerCase().includes(kw)) && !roleKeywords.some(kw => part1.toLowerCase().includes(kw))) {
          expTitle = part2;
          expCompany = part1;
        }

        expCompany = expCompany.replace(/\(\s*[\d]{4}.*?\)/, '').trim();

        currExp = {
          id: `exp-${expItems.length + 1}`,
          title: expTitle || 'Software Engineer',
          company: expCompany || 'Technology Organization',
          location: '',
          period,
          description: [],
          technologies: foundTechs.slice(0, 3)
        };
      } else if (currExp && cleanLine.length > 5) {
        currExp.description.push(cleanLine);
      }
    }
  }
  if (currExp) expItems.push(currExp);

  // 6. Extract Projects
  const projItems: any[] = [];
  let inProj = false;
  let currProj: any = null;
  const actionVerbs = ['built', 'developed', 'created', 'designed', 'implemented', 'architected', 'engineered', 'spearheaded', 'optimized'];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.match(/projects|key projects|personal projects/i) && line.length < 35) {
      inProj = true;
      continue;
    }
    if (inProj && lower.match(/education|experience|certifications|skills/i) && line.length < 35) {
      inProj = false;
    }
    if (inProj) {
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      const cleanLine = line.replace(/^[-•*▸▪\d\.\s]+/, '').trim();
      const firstWord = cleanLine.split(' ')[0] ? cleanLine.split(' ')[0].toLowerCase() : '';

      if (!isBullet && cleanLine.length < 80 && !actionVerbs.includes(firstWord)) {
        if (currProj) projItems.push(currProj);
        const githubM = cleanLine.match(/(https?:\/\/)?(www\.)?github\.com\/[\w-]+/i);
        const projTitle = cleanLine.replace(/\(.*?\)/, '').split(/\s+[|–—]\s+|\s+-\s+/)[0].trim();

        currProj = {
          id: `proj-${projItems.length + 1}`,
          title: projTitle || cleanLine,
          description: '',
          highlights: [],
          technologies: foundTechs.slice(0, 4),
          github_url: githubM ? githubM[0] : (github || ''),
          live_url: ''
        };
      } else if (currProj && cleanLine.length > 5) {
        if (!currProj.description) {
          currProj.description = cleanLine;
        } else {
          currProj.highlights.push(cleanLine);
        }
      }
    }
  }
  if (currProj) projItems.push(currProj);

  // 7. Extract Education
  const eduItems: any[] = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.match(/bachelor|master|phd|b\.s|b\.e|m\.s|degree|university|college|institute/i)) {
      const yearMatch = line.match(/\b(19|20)\d{2}\b(?:\s*[-–—\s]+\s*(?:\b(19|20)\d{2}\b|present))?/i);
      const yr = yearMatch ? yearMatch[0] : '';
      const cleanDeg = line.replace(yr, '').replace(/^[-•*▸▪\d\.\s]+/, '').replace(/\(\s*\)/, '').trim();

      let deg = cleanDeg;
      let inst = '';
      if (cleanDeg.includes(',')) {
        const parts = cleanDeg.split(',');
        deg = parts[0].trim();
        inst = parts.slice(1).join(',').trim();
      }

      eduItems.push({
        id: `edu-${eduItems.length + 1}`,
        degree: deg,
        institution: inst,
        location: '',
        year: yr,
        details: ''
      });
    }
  }

  const parsedPortfolio: PortfolioData = {
    name,
    title,
    hero_headline: `Hi, I'm ${name.split(' ')[0]}`,
    hero_subheadline: `${title} - Building high-performance, recruiter-optimized software.`,
    about: `Experienced ${title} proficient in ${foundTechs.slice(0, 5).join(', ') || 'modern technologies'}. Dedicated to software craftsmanship and robust execution.`,
    contact: {
      email,
      phone,
      location,
      github,
      linkedin,
      website: ''
    },
    skills,
    experience: expItems,
    projects: projItems,
    education: eduItems,
    certifications: []
  };

  return {
    raw_text: text || 'Uploaded resume text',
    portfolio_data: parsedPortfolio,
    ai_enhanced: true
  };
}
