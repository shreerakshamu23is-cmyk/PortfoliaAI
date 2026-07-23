'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/generate?step=3');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Opening Portfolio Studio Editor...</p>
      </div>
    </div>
  );
}
