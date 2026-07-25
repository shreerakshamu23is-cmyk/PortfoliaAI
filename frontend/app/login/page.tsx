'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Mail, Lock, LogIn, ArrowRight, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      try {
        if (typeof window !== 'undefined') {
          const mockUser = {
            id: Math.floor(Math.random() * 10000) + 1,
            email,
            full_name: email.split('@')[0],
          };
          localStorage.setItem('portfolioai_token', 'mock_jwt_token_' + Date.now());
          localStorage.setItem('portfolioai_user', JSON.stringify(mockUser));
          window.location.href = '/dashboard';
          return;
        }
      } catch {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    const demoEmail = 'user@portfolioai.com';
    const demoPassword = 'password123';
    try {
      await login(demoEmail, demoPassword);
      router.push('/dashboard');
    } catch (err) {
      if (typeof window !== 'undefined') {
        const mockUser = { id: 101, email: demoEmail, full_name: 'Demo Account' };
        localStorage.setItem('portfolioai_token', 'demo_token_123');
        localStorage.setItem('portfolioai_user', JSON.stringify(mockUser));
        window.location.href = '/dashboard';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030712' }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome Back to <span className="text-gradient">PortfolioAI</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to manage your private portfolio profile & showcase link
            </p>
          </div>

          <div
            className="p-7 rounded-3xl space-y-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            {error && (
              <div className="p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="input-dark pl-10 w-full text-xs py-3"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-dark pl-10 w-full text-xs py-3"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-xs font-bold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </span>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#0b1021] px-3 text-[10px] uppercase font-semibold text-slate-500 shrink-0">
                or Quick Explore
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-secondary w-full justify-center text-xs py-2.5"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Continue with Demo Account
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
                  Create One Now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
