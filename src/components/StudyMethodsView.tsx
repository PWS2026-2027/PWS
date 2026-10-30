import React, { useState, useEffect } from 'react';
import { UserProfile, StudyStrategyResponse } from '../types';
import { COGNITIVE_METHODS_EXPLAINED, VERIFIED_SOURCES, VWO_SUBJECTS } from '../data/vwoData';
import {
  Brain,
  Calendar,
  Sparkles,
  ExternalLink,
  BookCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Flame,
  HelpCircle,
  Zap,
  Play,
  Pause,
  RotateCcw,
  GraduationCap
} from 'lucide-react';

interface StudyMethodsViewProps {
  profile: UserProfile;
  onAddXP?: (amount: number, reason: string) => void;
}

export const StudyMethodsView: React.FC<StudyMethodsViewProps> = ({ profile, onAddXP }) => {
  // Generator state
  const [selectedSubject, setSelectedSubject] = useState(profile.favoriteSubjects[0] || 'Natuurkunde');
  const [topic, setTopic] = useState('');
  const [daysUntilExam, setDaysUntilExam] = useState<number>(7);
  const [currentStruggle, setCurrentStruggle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategyResult, setStrategyResult] = useState<StudyStrategyResponse | null>(null);

  // Sources Directory filter state
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceCategory, setSourceCategory] = useState<string>('Alle');

  // Active cognitive method modal or view
  const [activeMethodId, setActiveMethodId] = useState<string>('spaced_repetition');

  // Interactive Pomodoro Focus Timer for students
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroIsRunning, setPomodoroIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (pomodoroIsRunning) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(pomodoroSeconds - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(pomodoroMinutes - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer finished
          setPomodoroIsRunning(false);
          if (pomodoroMode === 'focus') {
            setPomodoroMode('break');
            setPomodoroMinutes(5);
            setPomodoroSeconds(0);
            onAddXP?.(50, 'Pomodoro focus-sessie van 25 minuten afgerond!');
          } else {
            setPomodoroMode('focus');
            setPomodoroMinutes(25);
            setPomodoroSeconds(0);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroIsRunning, pomodoroMinutes, pomodoroSeconds, pomodoroMode, onAddXP]);

  const handleToggleTimer = () => {
    setPomodoroIsRunning(!pomodoroIsRunning);
  };

  const handleResetTimer = (minutes: number = 25, mode: 'focus' | 'break' = 'focus') => {
    setPomodoroIsRunning(false);
    setPomodoroMode(mode);
    setPomodoroMinutes(minutes);
    setPomodoroSeconds(0);
  };

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/study-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic,
          daysUntilExam,
          currentStruggle,
          profile: profile.profile,
          level: profile.level,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Studiemethode genereren mislukt');
      }

      const data: StudyStrategyResponse = await res.json();
      setStrategyResult(data);
      onAddXP?.(40, 'Evidence-based studieplan gegenereerd met GeheugenHack');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Er is een verbindingsfout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSources = VERIFIED_SOURCES.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      s.subjects.some((sub) => sub.toLowerCase().includes(sourceSearch.toLowerCase()));

    const matchesCategory =
      sourceCategory === 'Alle' ||
      s.subjects.includes('Alle vakken') ||
      s.subjects.some((sub) => sub.includes(sourceCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Hero Visual Card: GeheugenHack */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <img
          src="/src/assets/images/feynman_study_method_1793370418952.jpg"
          alt="Cognitieve geheugenconsolidatie en Ebbinghaus vergeetcurve"
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
          referrerPolicy="no-referrer"
        />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                ⚡ GeheugenHack
              </span>
              <span aria-hidden="true">·</span>
              <span>Evidence-Based Leren</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">{profile.level}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              Hack je lange-termijn geheugen met cognitieve wetenschap.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Herlezen geeft je alleen de illusie van kennis (&quot;fluency illusion&quot;).
              Echt onthouden doe je met <strong>Spaced Retrieval</strong> en <strong>Interleaving</strong>:
              herhalen op het moment dat je het bijna vergeet.
            </p>
          </div>

          {/* Interactive Pomodoro Focus Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-64 text-center shrink-0 shadow-lg">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pomodoroMode === 'focus' ? '🎯 Focus Timer' : '☕ Pauze'}</span>
            </div>
            <div className="text-3xl font-mono font-extrabold text-white tracking-wider my-1">
              {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleToggleTimer}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                {pomodoroIsRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{pomodoroIsRunning ? 'Pauze' : 'Start'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleResetTimer(25, 'focus')}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Interactive Cognitive Methods Explorer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-600" />
            <span>De 5 Bewezen Geheugentechnieken</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geen meningen, maar experimenteel bewezen leermethoden van Ebbinghaus, Roediger en Bjork.
          </p>
        </div>

        {/* Method selector tabs */}
        <div className="flex flex-wrap gap-2">
          {COGNITIVE_METHODS_EXPLAINED.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethodId(method.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMethodId === method.id
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {method.shortName}
            </button>
          ))}
        </div>

        {/* Selected method detail card */}
        {(() => {
          const currentMethod = COGNITIVE_METHODS_EXPLAINED.find((m) => m.id === activeMethodId);
          if (!currentMethod) return null;

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentMethod.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">Onderzoekers: {currentMethod.pioneers}</div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                  VWO Voordeel
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                <div className="font-bold text-slate-900">Hoe dit je neuronen beïnvloedt:</div>
                <p className="font-medium">{currentMethod.principle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Optimaal Schema & Tijdsinterval</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium">
                    {currentMethod.goldenIntervals}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    <span>Waarom dit op het VWO het verschil maakt</span>
                  </div>
                  <div className="text-xs text-amber-900 leading-relaxed font-medium">
                    {currentMethod.vwoBenefit}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Section 2: Custom Study Strategy Generator */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Persoonlijke GeheugenPlanner Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geef je toetsdatum op. GeheugenHack berekent de exacte herhaaldagen volgens de vergeetcurve.
          </p>
        </div>

        <form onSubmit={handleGenerateStrategy} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Vak
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
              >
                {VWO_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Onderwerp of Toetshoofdstuk
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Bijv. Elektromagnetisme & Inductie of Zuren & Basen evenwichten"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
              <label className="block text-xs font-bold text-amber-950 mb-1.5">
                Dagen tot de toets: <span className="text-amber-800 font-extrabold">{daysUntilExam} dagen</span>
              </label>
              <input
                type="range"
                min="2"
                max="30"
                value={daysUntilExam}
                onChange={(e) => setDaysUntilExam(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-amber-800/80 mt-1 font-semibold">
                <span>2d (Sprint)</span>
                <span>14d (Ideaal)</span>
                <span>30d (Examentraining)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Waar loop je tegenaan? (Optioneel)
              </label>
              <input
                type="text"
                value={currentStruggle}
                onChange={(e) => setCurrentStruggle(e.target.value)}
                placeholder="Bijv. Ik haal formules door elkaar of vergeet theorie na 2 dagen"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-200"
          >
            {loading ? (
              <span>Cognitief schema berekenen...</span>
            ) : (
              <>
                <span>Genereer GeheugenPlanner (+40 XP)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Generated Study Strategy Result */}
        {strategyResult && !loading && (
          <div className="space-y-6 pt-6 border-t border-slate-100 animate-in fade-in duration-200">
            {/* Cognitive Principles Applied */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Aanbevolen Wetenschappelijke Principes:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strategyResult.cognitivePrinciples.map((cp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{cp.name}</div>
                    <div className="text-slate-600 font-medium">{cp.scientificEvidence}</div>
                    <div className="text-amber-800 font-bold pt-1">
                      Toepassing: {cp.howToApply}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day by Day Schedule */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Gecalibreerd Studierooster (Spaced & Interleaved):</span>
              </h3>

              <div className="space-y-2.5">
                {strategyResult.studySchedule.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded-md">
                          Dag {day.dayOffset}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {day.phaseName}
                        </span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-0.5 pl-1 list-disc list-inside font-medium">
                        {day.activities.map((act, aIdx) => (
                          <li key={aIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg shrink-0">
                      {day.recommendedDurationMinutes} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credible Sources Tailored for this Subject */}
            {strategyResult.credibleSources && strategyResult.credibleSources.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Betrouwbare Bronnen voor dit Onderwerp:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {strategyResult.credibleSources.map((src, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{src.title}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                          {src.category}
                        </span>
                      </div>
                      <div className="text-slate-600 font-medium">{src.relevance}</div>
                      <div className="text-amber-950 font-mono text-[11px] pt-1 font-semibold">
                        Zoekterm / Link: {src.searchQueryOrLink}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 3: Credible Sources Hub for Dutch VWO */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Officiële & Betrouwbare Bronnen Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geen Wikipedia of vage fora. Gebruik deze officiële databanken voor je SE en PWS.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              placeholder="Zoek bron op naam of vak..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 text-xs">
            {['Alle', 'Nederlands', 'Engels', 'Duits', 'Biologie', 'Scheikunde', 'Natuurkunde', 'Wiskunde B'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSourceCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                  sourceCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSources.map((source, idx) => (
            <article
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{source.name}</h3>
                    <div className="text-xs text-amber-700 font-mono mt-0.5">{source.domain}</div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {source.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {source.description}
                </p>

                <div className="p-2.5 bg-amber-50/50 rounded-lg text-[11px] text-amber-950 border border-amber-200/50">
                  <span className="font-bold">Waarom universitair betrouwbaar: </span>
                  <span>{source.whyTrust}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Vakken: {source.subjects.join(', ')}</span>
                <a
                  href={`https://${source.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>Bezoek portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
