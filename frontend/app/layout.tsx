import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PortfolioAI | AI Resume to Premium Recruiter Portfolio',
  description: 'Transform your PDF/DOCX resume into an animated, recruiter-ready portfolio website in under 2 minutes powered by IBM Granite AI.',
  keywords: ['PortfolioAI', 'AI Portfolio Generator', 'IBM Granite', 'watsonx.ai', 'Resume to Portfolio', 'Developer Portfolio'],
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${serif.variable} dark`}>
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
