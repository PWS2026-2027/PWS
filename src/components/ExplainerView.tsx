import React, { useState } from 'react';
import { UserProfile, ExplainerResponse } from '../types';
import { POPULAR_EXPLAINER_TOPICS, VWO_SUBJECTS } from '../data/vwoData';
import {
  Search,
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Compass,
  ArrowRight,
  Brain,
  Zap,
  CheckCircle2,
  Atom,
  Timer
} from 'lucide-react';

interface ExplainerViewProps {
  profile: UserProfile;
  onAddXP?: (amount: number, reason: string) => void;
}

export const ExplainerView: React.FC<ExplainerViewProps> = ({ profile, onAddXP }) => {
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Alle vakken');
  const [contextMode, setContextMode] = useState<'first_principles' | 'intuitive_analogy' | 'exam_prep'>('first_principles');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainerResponse | null>(null);
  const [revealedHints, setRevealedHints] = useState<{ [index: number]: boolean }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [index: number]: boolean }>({});
  const [savedNotes, setSavedNotes] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('vwo_saved_explanations') || '[]');
    } catch {
      return [];
    }
  });

  const handleSearch = async (searchQuery: string = query, subjectToUse: string = selectedSubject) => {
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setRevealedHints({});
    setRevealedAnswers({});

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          subject: subjectToUse === 'Alle vakken' ? '' : subjectToUse,
          level: profile.level,
          contextMode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Uitleg ophalen mislukt');
      }

      const data: ExplainerResponse = await res.json();
      setResult(data);
      onAddXP?.(35, 'Nieuw concept ontrafeld met BreinKraak');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Er ging iets mis bij het verbinden met de server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPopular = (item: typeof POPULAR_EXPLAINER_TOPICS[0]) => {
    setQuery(item.query);
    setSelectedSubject(item.subject);
    handleSearch(item.query, item.subject);
  };

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleAnswer = (idx: number) => {
    const wasOpen = revealedAnswers[idx];
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
    if (!wasOpen) {
      onAddXP?.(20, 'Active Recall vraag gecontroleerd');
    }
  };

  const handleSaveResult = () => {
    if (!result || !query) return;
    const itemTitle = `${selectedSubject !== 'Alle vakken' ? selectedSubject + ': ' : ''}${query.slice(0, 50)}...`;
    if (!savedNotes.includes(itemTitle)) {
      const updated = [itemTitle, ...savedNotes.slice(0, 9)];
      setSavedNotes(updated);
      localStorage.setItem('vwo_saved_explanations', JSON.stringify(updated));
      onAddXP?.(15, 'Notitie opgeslagen in jouw kluis');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Visual Banner: BreinKraak */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <img
          src="/src/assets/images/hero_vwo_coach_1793370418781.jpg"
          alt="VWO Academische Studieplek met Binas en aantekeningen"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="relative p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
              ⚡ BreinKraak
            </span>
            <span aria-hidden="true">·</span>
            <span>De KennisVerdieper</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{profile.level}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
            Geen droge samenvatting, maar écht begrijpen vanaf de basis.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Stel elke vraag uit je VWO-curriculum. BreinKraak pakt het probleem aan bij de eerste natuurwet of logica,
            geeft een herkenbare beeldspraak, vermeldt de officiële Binas- en syllabustabellen en test direct of het blijft hangen.
          </p>
        </div>
      </div>

      {/* Search Input Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bijv. Waarom verschuift het Bohr-effect bij zuurstoftransport? Of: Hoe werkt magnetische flux?"
              className="w-full pl-11 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium"
            />
            <Search className="w-5 h-5 text-indigo-500 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-200"
            >
              {loading ? (
                <span>Kraken...</span>
              ) : (
                <>
                  <span>Kraak Het!</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Filter Bar: Subject & Explanation Perspective */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Vak:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs font-semibold bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Alle vakken">Alle vakken</option>
                {VWO_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Explanation Depth Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setContextMode('first_principles')}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  contextMode === 'first_principles'
                    ? 'bg-white text-indigo-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔬 Eerste Principes
              </button>
              <button
                type="button"
                onClick={() => setContextMode('intuitive_analogy')}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  contextMode === 'intuitive_analogy'
                    ? 'bg-white text-indigo-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💡 Beeldende Metafoor
              </button>
              <button
                type="button"
                onClick={() => setContextMode('exam_prep')}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  contextMode === 'exam_prep'
                    ? 'bg-white text-indigo-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎯 Examen Focus
              </button>
            </div>
          </div>
        </form>

        {/* Popular VWO Search Topics */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Populaire BreinKrakers voor VWO:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_EXPLAINER_TOPICS.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectPopular(item)}
                className="text-xs bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors text-left truncate max-w-xs font-medium"
              >
                <span className="font-bold text-indigo-700">{item.subject}: </span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <div className="font-bold">Kon de vraag niet verwerken</div>
            <div className="text-xs mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 animate-pulse">
          <div className="h-6 bg-indigo-100 rounded-md w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded-md w-full"></div>
            <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded-md w-4/6"></div>
          </div>
          <div className="p-4 bg-indigo-50/50 rounded-xl space-y-2">
            <div className="h-4 bg-indigo-200 rounded-md w-1/3"></div>
            <div className="h-3 bg-indigo-100 rounded-md w-2/3"></div>
          </div>
        </div>
      )}

      {/* Result Container */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Main Explanation Card */}
          <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {selectedSubject}
                </span>
                <span aria-hidden="true">·</span>
                <span>VWO Bovenbouw</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">Geverifieerde Uitwerking</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveResult}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bewaar in kluis</span>
                </button>
              </div>
            </div>

            {/* Core Takeaway Summary */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50/50 to-indigo-50 rounded-xl p-5 border border-indigo-100">
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Kerninzicht in 1 zin</span>
              </div>
              <p className="text-sm font-semibold text-indigo-950 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Core Concepts */}
            {result.coreConcepts && result.coreConcepts.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fundamentele Bouwstenen:
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {result.coreConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* In-depth First Principles Breakdown */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Atom className="w-4 h-4 text-indigo-600" />
                <span>Waarom het zo werkt (Eerste Principes & Mechanisme)</span>
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {result.firstPrinciples}
              </div>
            </div>

            {/* Real World Analogy */}
            {result.realWorldAnalogy && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/50 border border-amber-200/80 space-y-1.5">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Beeldende Metafoor (Het Aha-moment)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  {result.realWorldAnalogy}
                </p>
              </div>
            )}

            {/* Formulas / Math / Reactions (if present) */}
            {result.formulasOrMechanisms && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
                <div className="text-indigo-400 text-xs font-sans font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Wiskundige Notatie & Binas Vergelijkingen</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono leading-relaxed text-indigo-100">
                  {result.formulasOrMechanisms}
                </pre>
              </div>
            )}

            {/* VWO Syllabus context */}
            {result.vwoContext && (
              <div className="text-xs text-slate-700 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950">Relevantie voor het Examen (CvTE Syllabus): </span>
                  <span className="text-emerald-900">{result.vwoContext}</span>
                </div>
              </div>
            )}

            {/* Verifiable Academic Sources */}
            {result.academicSources && result.academicSources.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Geverifieerde Bronnen & Binas Tabellen
                  </h4>
                  <span className="text-xs text-emerald-600 font-semibold">100% traceerbaar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.academicSources.map((source, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5 hover:border-indigo-300 transition-colors"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{source.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <div className="text-slate-600">{source.urlDescription}</div>
                      <div className="text-indigo-900 font-medium text-[11px] bg-indigo-50/80 p-1.5 rounded">
                        Waarom universitair betrouwbaar: {source.whyCredible}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Active Recall Practice Section */}
          {result.checkQuestions && result.checkQuestions.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Active Recall Zelftest (+20 XP per antwoord)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Probeer eerst zelf te antwoorden vóórdat je op controleren klikt! Dit stimuleert synaptische verankering.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {result.checkQuestions.map((q, idx) => {
                  const isHintOpen = revealedHints[idx];
                  const isAnswerOpen = revealedAnswers[idx];

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <div className="font-semibold text-sm text-slate-900">
                          {q.question}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 pl-9">
                        {q.hint && (
                          <button
                            type="button"
                            onClick={() => toggleHint(idx)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 border border-amber-200 rounded-md transition-colors flex items-center gap-1"
                          >
                            <span>{isHintOpen ? 'Verberg hint' : '💡 Denkrichting'}</span>
                            {isHintOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleAnswer(idx)}
                          className="px-3 py-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>{isAnswerOpen ? 'Verberg modelantwoord' : '✓ Controleer antwoord (+20 XP)'}</span>
                          {isAnswerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Hint Drawer */}
                      {isHintOpen && (
                        <div className="ml-9 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 rounded-lg">
                          <span className="font-bold">Denkrichting: </span>
                          <span>{q.hint}</span>
                        </div>
                      )}

                      {/* Answer Drawer */}
                      {isAnswerOpen && (
                        <div className="ml-9 p-4 bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 rounded-xl space-y-1 animate-in fade-in duration-150 shadow-xs">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>VWO Modeluitwerking & Puntenverdeling:</span>
                          </div>
                          <p className="leading-relaxed text-emerald-900">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
