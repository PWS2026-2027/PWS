/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { ProfileModal } from './components/ProfileModal';
import { ExplainerView } from './components/ExplainerView';
import { TaalCoachView } from './components/TaalCoachView';
import { StudyMethodsView } from './components/StudyMethodsView';
import { HomeworkHelperView } from './components/HomeworkHelperView';
import { FeynmanSandboxView } from './components/FeynmanSandboxView';
import { Sparkles, Flame, CheckCircle, ExternalLink, GraduationCap } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  level: 'VWO 5',
  profile: 'Natuur & Techniek (NT)',
  favoriteSubjects: ['Nederlands', 'Engels', 'Natuurkunde', 'Wiskunde B'],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'explainer' | 'taal' | 'methods' | 'homework' | 'feynman'>('explainer');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Gamification: XP and streak
  const [xp, setXp] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('vwo_user_xp') || '250');
    } catch {
      return 250;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('vwo_user_streak') || '3');
    } catch {
      return 3;
    }
  });

  const [xpNotification, setXpNotification] = useState<{ amount: number; text: string } | null>(null);

  const addXP = (amount: number, text: string) => {
    setXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('vwo_user_xp', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setXpNotification({ amount, text });
    setTimeout(() => {
      setXpNotification(null);
    }, 3500);
  };

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('vwo_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('vwo_user_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
    addXP(25, 'Profiel geüpdatet');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/20 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        xp={xp}
        streakDays={streakDays}
      />

      {/* Floating XP Reward Notification Toast */}
      {xpNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ★
            </span>
            <div>
              <span className="text-amber-400 font-bold">+{xpNotification.amount} XP! </span>
              <span>{xpNotification.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explainer' && <ExplainerView profile={profile} onAddXP={addXP} />}
        {activeTab === 'taal' && <TaalCoachView profile={profile} onAddXP={addXP} />}
        {activeTab === 'methods' && <StudyMethodsView profile={profile} onAddXP={addXP} />}
        {activeTab === 'homework' && <HomeworkHelperView profile={profile} onAddXP={addXP} />}
        {activeTab === 'feynman' && <FeynmanSandboxView profile={profile} onAddXP={addXP} />}
      </main>

      {/* Clean Academic Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">VWO Mentor</span>
            <span aria-hidden="true">·</span>
            <span>BreinKraak · TaalBaas · GeheugenHack · Socrates Bot · JargonBuster</span>
            <span aria-hidden="true">·</span>
            <span>VWO 4, 5 & 6</span>
          </div>

          <div className="flex items-center gap-5 text-slate-600">
            <a
              href="https://www.examenblad.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Examenblad.nl
            </a>
            <a
              href="https://www.onzetaal.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Onze Taal
            </a>
            <a
              href="https://www.nemokennislink.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              NEMO Kennislink
            </a>
            <a
              href="https://www.knaw.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              KNAW
            </a>
          </div>
        </div>
      </footer>

      {/* Profile & Level Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
