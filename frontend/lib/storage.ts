import { PortfolioData, ThemeType, Portfolio } from '@/types/portfolio';

const DRAFT_PORTFOLIO_KEY = 'portfolioai_draft_data';
const DRAFT_THEME_KEY = 'portfolioai_draft_theme';
const SAVED_PORTFOLIOS_KEY = 'portfolioai_saved_list';

export const StorageService = {
  getDraftData(): PortfolioData | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(DRAFT_PORTFOLIO_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveDraftData(data: PortfolioData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DRAFT_PORTFOLIO_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving draft data', e);
    }
  },

  clearDraft(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(DRAFT_PORTFOLIO_KEY);
      localStorage.removeItem(DRAFT_THEME_KEY);
    } catch (e) {
      console.error('Error clearing draft data', e);
    }
  },

  getDraftTheme(): ThemeType {
    if (typeof window === 'undefined') return 'modern-glass';
    try {
      const theme = localStorage.getItem(DRAFT_THEME_KEY) as ThemeType;
      return theme || 'modern-glass';
    } catch {
      return 'modern-glass';
    }
  },

  saveDraftTheme(theme: ThemeType): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DRAFT_THEME_KEY, theme);
    } catch (e) {
      console.error('Error saving draft theme', e);
    }
  },

  savePortfolioToHistory(portfolio: Portfolio): void {
    if (typeof window === 'undefined') return;
    try {
      const existingStr = localStorage.getItem(SAVED_PORTFOLIOS_KEY);
      const list: Portfolio[] = existingStr ? JSON.parse(existingStr) : [];
      const index = list.findIndex(p => p.id === portfolio.id);
      if (index >= 0) {
        list[index] = portfolio;
      } else {
        list.unshift(portfolio);
      }
      localStorage.setItem(SAVED_PORTFOLIOS_KEY, JSON.stringify(list));
      localStorage.setItem(`portfolio_${portfolio.id}`, JSON.stringify(portfolio));
    } catch (e) {
      console.error('Error saving portfolio to history', e);
    }
  },

  getSavedPortfolios(): Portfolio[] {
    if (typeof window === 'undefined') return [];
    try {
      const str = localStorage.getItem(SAVED_PORTFOLIOS_KEY);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }
};
