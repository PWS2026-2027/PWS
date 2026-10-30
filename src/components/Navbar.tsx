import React from 'react';
import { UserProfile } from '../types';
import {
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Flame,
  Zap,
  Brain,
  Languages,
  Compass,
  Bot,
  Scissors
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'explainer' | 'taal' | 'methods' | 'homework' | 'feynman';
  setActiveTab: (tab: 'explainer' | 'taal' | 'methods' | 'homework' | 'feynman') => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  xp: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  xp,
  streakDays,
}) => {
  const tabs = [
    {
      id: 'explainer' as const,
      label: 'BreinKraak',
      subtitle: 'KennisVerdieper',
      icon: <Brain className="w-4 h-4 text-indigo-500" />,
      colorClass: 'text-indigo-600',
      activeLine: 'bg-indigo-600',
      tagColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'taal' as const,
      label: 'TaalBaas',
      subtitle: 'CITO & Spelling',
      icon: <Languages className="w-4 h-4 text-emerald-500" />,
      colorClass: 'text-emerald-600',
      activeLine: 'bg-emerald-600',
      tagColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'methods' as const,
      label: 'GeheugenHack',
      subtitle: 'Studiemethoden',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      colorClass: 'text-amber-600',
      activeLine: 'bg-amber-500',
      tagColor: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'homework' as const,
      label: 'Socrates Bot',
      subtitle: 'Huiswerk Scanner',
      icon: <Bot className="w-4 h-4 text-sky-500" />,
      colorClass: 'text-sky-600',
      activeLine: 'bg-sky-500',
      tagColor: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'feynman' as const,
      label: 'JargonBuster',
      subtitle: 'Feynman Test',
      icon: <Scissors className="w-4 h-4 text-fuchsia-500" />,
      colorClass: 'text-fuchsia-600',
      activeLine: 'bg-fuchsia-600',
      tagColor: 'bg-fuchsia-50 text-fuchsia-700',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => setActiveTab('explainer')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent whitespace-nowrap">
              VWO Mentor
            </span>
          </button>

          {/* Zone 2: 5 single-line nav links with vibrant twists */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-all relative flex items-center gap-1.5 ${
                    isActive ? `${t.colorClass} font-bold` : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="opacity-90">{t.icon}</span>
                  <span>{t.label}</span>
                  {isActive && (
                    <span
                      className={`absolute -bottom-2.5 left-0 right-0 h-0.5 ${t.activeLine} rounded-full`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Gamified Streak & XP + Profile Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Gamified XP & Streak */}
            <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                <span>{streakDays}d</span>
              </span>
              <span className="text-amber-300">|</span>
              <span className="flex items-center gap-1 text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{xp} XP</span>
              </span>
            </div>

            {/* Profile & Level Button */}
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Wijzig leerjaar en profiel"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{profile.level}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">{profile.profile.split(' ')[0]}</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none border-t border-slate-100 text-xs font-semibold">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
