import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Wand2, LayoutDashboard, Menu, X, ArrowLeft, Home, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  currentStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06]" style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">
                Portfolio<span className="text-gradient">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold badge badge-indigo">
                IBM Granite
              </span>
            </div>
          </Link>

          {/* Home Link if on inner pages like /dashboard or /generate */}
          {pathname !== '/' && (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          )}
        </div>

        {/* Step Progress (studio flow only) */}
        {currentStep !== undefined && (
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full glass text-[11px] font-medium">
            {[
              { n: 1, label: 'Upload' },
              { n: 3, label: 'Customize' },
              { n: 4, label: 'Export' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                {i > 0 && <span className="text-slate-700 mx-1">›</span>}
                <span className={currentStep >= s.n ? 'text-indigo-400 font-semibold' : 'text-slate-500'}>
                  {s.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Desktop Nav (Works from any page!) */}
        {currentStep === undefined && (
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/#themes" className="hover:text-white transition-colors">Themes</Link>
            <Link href="/dashboard" className={`hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-indigo-400 font-medium' : ''}`}>
              Dashboard
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white uppercase">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline line-clamp-1 max-w-[100px]">
                  {user?.full_name || user?.email?.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" /> Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </Link>
            </div>
          )}

          <Link href="/generate" className="btn-primary py-1.5 px-3.5 text-xs">
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Portfolio</span>
            <span className="sm:hidden">Create</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass text-slate-300"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]"
            style={{ background: 'rgba(10,15,30,0.95)' }}
          >
            <div className="px-4 py-5 space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all">
                <Home className="w-4 h-4 mr-2" /> Home Page
              </Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-indigo-400 font-medium hover:bg-white/[0.05] transition-all">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-xs justify-center py-2">
                    <LogIn className="w-3.5 h-3.5 text-indigo-400" /> Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-xs justify-center py-2">
                    <UserPlus className="w-3.5 h-3.5" /> Sign Up
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out ({user?.full_name || user?.email})
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
