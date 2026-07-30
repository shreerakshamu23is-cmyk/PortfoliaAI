'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiService } from '@/lib/api';
import { Portfolio } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio/Themes';
import { Loader2 } from 'lucide-react';

export default function PublicPreviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    ApiService.getPortfolio(id)
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Portfolio not found or unavailable');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white space-y-4 text-center p-4">
        <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
        <p className="text-sm text-slate-400">The requested portfolio link might have expired or been removed.</p>
        <a href="/" className="btn-primary text-xs py-2 px-4">
          Create Portfolio
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] relative">
      {/* 100% Clean Portfolio Website View */}
      <PortfolioRenderer data={portfolio.data} theme={portfolio.theme} />
    </div>
  );
}



