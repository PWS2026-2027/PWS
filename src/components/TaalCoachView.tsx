import React, { useState } from 'react';
import { UserProfile, LanguageSubject, LanguageMode, LanguageAssistantResponse } from '../types';
import { LANGUAGE_PRESETS } from '../data/vwoData';
import {
  Languages,
  BookOpen,
  PenTool,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Flame,
  Check,
  Zap,
  Bookmark
} from 'lucide-react';

interface TaalCoachViewProps {
  profile: UserProfile;
  onAddXP?: (amount: number, reason: string) => void;
}

export const TaalCoachView: React.FC<TaalCoachViewProps> = ({ profile, onAddXP }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSubject>('Nederlands');
  const [selectedMode, setSelectedMode] = useState<LanguageMode>('reading_comprehension');
  const [textOrQuery, setTextOrQuery] = useState('');
  const [contextQuestion, setContextQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LanguageAssistantResponse | null>(null);

  // Quiz state
  const [quizHintOpen, setQuizHintOpen] = useState(false);
  const [quizAnswerOpen, setQuizAnswerOpen] = useState(false);

  const handleAnalyze = async (queryText: string = textOrQuery, lang: LanguageSubject = selectedLanguage, mode: LanguageMode = selectedMode) => {
    const q = queryText.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setQuizHintOpen(false);
    setQuizAnswerOpen(false);

    try {
      const res = await fetch('/api/language-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          mode,
          textOrQuery: q,
          contextQuestion: contextQuestion.trim() || undefined,
          level: profile.level,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Kon taalvraag niet analyseren');
      }

      const data: LanguageAssistantResponse = await res.json();
      setResult(data);
      onAddXP?.(35, `${lang} analyse voltooid in TaalBaas`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Er is een verbindingsfout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (preset: typeof LANGUAGE_PRESETS[0]) => {
    setSelectedLanguage(preset.language);
    setSelectedMode(preset.mode);
    setTextOrQuery(preset.query);
    setContextQuestion('');
    handleAnalyze(preset.query, preset.language, preset.mode);
  };

  const handleCheckQuizAnswer = () => {
    const wasOpen = quizAnswerOpen;
    setQuizAnswerOpen(!quizAnswerOpen);
    if (!wasOpen) {
      onAddXP?.(25, 'TaalBaas CITO-oefening gecheckt');
    }
  };

  const languages: { id: LanguageSubject; flag: string; label: string; accentColor: string }[] = [
    { id: 'Nederlands', flag: '🇳🇱', label: 'Nederlands', accentColor: 'border-orange-300 text-orange-950 bg-orange-50/50' },
    { id: 'Engels', flag: '🇬🇧', label: 'Engels', accentColor: 'border-blue-300 text-blue-950 bg-blue-50/50' },
    { id: 'Duits', flag: '🇩🇪', label: 'Duits', accentColor: 'border-amber-300 text-amber-950 bg-amber-50/50' },
    { id: 'Frans', flag: '🇫🇷', label: 'Frans', accentColor: 'border-indigo-300 text-indigo-950 bg-indigo-50/50' },
  ];

  const modes: { id: LanguageMode; label: string; icon: React.ReactNode; desc: string; badge: string }[] = [
    {
      id: 'reading_comprehension',
      label: '1. CITO Tekst & Alinea\'s',
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      desc: 'Hoofdgedachte, signaalwoorden & auteurshouding',
      badge: 'Lezen',
    },
    {
      id: 'spelling_grammar',
      label: '2. Spelling & Beslisbomen',
      icon: <PenTool className="w-4 h-4 text-sky-600" />,
      desc: 'd/t-flowcharts, naamvallen & werkwoordstijden',
      badge: 'Grammatica',
    },
    {
      id: 'idiom_vocabulary',
      label: '3. Idioom & Valse Vrienden',
      icon: <MessageSquare className="w-4 h-4 text-purple-600" />,
      desc: 'Figuurlijke betekenis, herkomst & faux amis',
      badge: 'Idioom',
    },
  ];

  const filteredPresets = LANGUAGE_PRESETS.filter((p) => p.language === selectedLanguage);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Banner: TaalBaas */}
      <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-md relative">
        <img
          src="/src/assets/images/language_study_desk_1793371067880.jpg"
          alt="Taalstudie bureau met literatuurboeken en markeringen"
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="relative space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
              🗣️ TaalBaas
            </span>
            <span aria-hidden="true">·</span>
            <span>Leesteksten, Spelling & Idioom</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">{profile.level}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            Sloop CITO-instinkers & tem de taalkwesties.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Met TaalBaas ontleed je ingewikkelde leesteksten, ontmasker je valse vrienden (false friends),
            en doorloop je kristalheldere stroomschema&apos;s voor d/t-spelling, Duitse naamvallen en Franse tijden.
          </p>
        </div>
      </div>

      {/* Main Interactive Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step 1: Language Tabs Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
              <span>Kies je Taal</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">4 VWO Bovenbouwtalen</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((l) => {
              const isSelected = selectedLanguage === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLanguage(l.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Function Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px]">2</span>
            <span>Wat wil je aanpakken?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modes.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMode(m.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {m.icon}
                        <span>{m.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {m.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {m.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-4 pt-3 border-t border-slate-100"
        >
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
              <span>
                {selectedMode === 'reading_comprehension' && 'Plak hier de alinea of het tekstfragment:'}
                {selectedMode === 'spelling_grammar' && 'Voer de werkwoordsvorm of grammaticavraag in:'}
                {selectedMode === 'idiom_vocabulary' && 'Voer de uitdrukking of het moeilijke idioom in:'}
              </span>
            </label>
            <textarea
              rows={selectedMode === 'reading_comprehension' ? 5 : 3}
              value={textOrQuery}
              onChange={(e) => setTextOrQuery(e.target.value)}
              placeholder={
                selectedMode === 'reading_comprehension'
                  ? 'Bijv: "To argue that generative AI democratises artistic brilliance is to confuse widespread accessibility with genuine creative insight..."'
                  : selectedMode === 'spelling_grammar'
                  ? 'Bijv: Waarom schrijf je "hij updatet" maar "geüpdatet"? Of: Wanneer gebruik je in het Duits Dativ vs Akkusativ?'
                  : 'Bijv: Wat betekent "advocaat van de duivel", "Schwein haben" of verklaar de valse vriend "sympathetic".'
              }
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-600 font-sans leading-relaxed font-medium"
              required
            />
          </div>

          {selectedMode === 'reading_comprehension' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specifieke meerkeuze- of examenvraag (Optioneel):
              </label>
              <input
                type="text"
                value={contextQuestion}
                onChange={(e) => setContextQuestion(e.target.value)}
                placeholder="Bijv. Vraag 18: Wat is de houding van de auteur in alinea 3?"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>
          )}

          {/* Preset Buttons for the Selected Language */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct testen met VWO-voorbeelden voor {selectedLanguage}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 transition-colors text-left font-medium shadow-2xs"
                >
                  <span className="font-bold text-emerald-800">{preset.title}</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">({preset.badge})</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !textOrQuery.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-emerald-200"
            >
              {loading ? (
                <span>Taal ontleden...</span>
              ) : (
                <>
                  <span>Ontleed met TaalBaas</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 animate-pulse">
          <div className="h-5 bg-emerald-100 rounded-md w-1/2"></div>
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
          <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
          <div className="h-20 bg-emerald-50/50 rounded-xl"></div>
        </div>
      )}

      {/* Analysis Result Display */}
      {result && !loading && (
        <div className="space-y-6">
          <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {result.language}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize font-semibold text-slate-700">{result.mode.replace('_', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 font-bold">VWO CITO Niveau</span>
              </div>
            </div>

            {/* Main takeaway card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-700" />
                <span>Kerninzicht & Oploslogica</span>
              </div>
              <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                {result.mainTakeaway}
              </p>
            </div>

            {/* 1. Reading Comprehension Specific Display */}
            {result.readingAnalysis && (
              <div className="space-y-6">
                {/* Main Idea */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Hoofdgedachte van de tekst:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-medium">
                    {result.readingAnalysis.mainIdea}
                  </p>
                </div>

                {/* Paragraph functions */}
                {result.readingAnalysis.paragraphFunctions && result.readingAnalysis.paragraphFunctions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Alineafuncties (Officiële CITO Typologie):
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.readingAnalysis.paragraphFunctions.map((pf, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{pf.paragraph}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                              {pf.functionType}
                            </span>
                          </div>
                          <p className="text-slate-600">{pf.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signal words */}
                {result.readingAnalysis.signalWords && result.readingAnalysis.signalWords.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Cruciale Signaalwoorden & Alineaverbanden:
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-emerald-50/70 text-emerald-950 border-b border-emerald-200">
                          <tr>
                            <th className="py-2.5 px-3 font-bold">Signaalwoord</th>
                            <th className="py-2.5 px-3 font-bold">Logisch Verband</th>
                            <th className="py-2.5 px-3 font-bold">Impact op Betoog</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.readingAnalysis.signalWords.map((sw, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                                {sw.word}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {sw.relation}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {sw.impact}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tone and Stance */}
                {result.readingAnalysis.toneAndStance && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-950">
                      Houding van de Auteur (Attitude & Tone):
                    </div>
                    <p className="text-amber-900 leading-relaxed font-medium">
                      {result.readingAnalysis.toneAndStance}
                    </p>
                  </div>
                )}

                {/* CITO Question Trap Breakdown */}
                {result.readingAnalysis.citoQuestionBreakdown && (
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-2.5">
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>CITO Examen-Instinker & Eliminatie</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-rose-300 font-bold">De veelgemaakte instinker (foute afleider):</div>
                      <p className="text-slate-300">{result.readingAnalysis.citoQuestionBreakdown.trap}</p>
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-slate-800">
                      <div className="text-emerald-400 font-bold">Het sluitende bewijs in de tekst:</div>
                      <p className="text-slate-300">{result.readingAnalysis.citoQuestionBreakdown.correctLogic}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Grammar & Spelling Specific Display */}
            {result.grammarRule && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Regel: {result.grammarRule.ruleName}
                  </h3>
                </div>

                {/* Flowchart / Decision Steps */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Stapsgewijze Beslisboom (Flowchart):
                  </div>
                  <div className="space-y-2">
                    {result.grammarRule.flowchartSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium"
                      >
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mnemonic / Trick */}
                {result.grammarRule.mnemonicOrTrick && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900">Het Gouden Ezelsbruggetje: </span>
                      <span className="leading-relaxed font-semibold">{result.grammarRule.mnemonicOrTrick}</span>
                    </div>
                  </div>
                )}

                {/* Correct vs Incorrect Examples */}
                {result.grammarRule.exampleCorrectVsIncorrect && result.grammarRule.exampleCorrectVsIncorrect.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Goed versus Fout in de Praktijk:
                    </div>
                    <div className="space-y-2">
                      {result.grammarRule.exampleCorrectVsIncorrect.map((ex, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/40">
                          <div className="space-y-1">
                            <div className="font-bold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Goed:</span>
                            </div>
                            <div className="font-mono bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-950 font-bold">
                              {ex.correct}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="font-bold text-rose-600 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Fout:</span>
                            </div>
                            <div className="font-mono bg-rose-50 border border-rose-200 p-2 rounded-lg text-rose-950 line-through font-semibold">
                              {ex.incorrect}
                            </div>
                            <div className="text-[11px] text-slate-500 pt-0.5">
                              {ex.reason}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Idiom & Vocabulary Specific Display */}
            {result.idiomBreakdown && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
                    <span className="uppercase tracking-wider">Vaste Constructie / Idioom</span>
                    <span className="bg-purple-800/60 border border-purple-600/50 px-2.5 py-0.5 rounded text-white font-medium">
                      Register: {result.idiomBreakdown.register}
                    </span>
                  </div>
                  <div className="text-xl font-bold font-serif text-white">
                    {result.idiomBreakdown.expression}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700">
                      <div className="text-slate-400 mb-0.5 font-medium">Letterlijke vertaling:</div>
                      <div className="text-slate-200 font-medium">{result.idiomBreakdown.literalTranslation}</div>
                    </div>
                    <div className="p-3 bg-purple-900/60 border border-purple-500/40 rounded-xl">
                      <div className="text-purple-300 mb-0.5 font-bold">Werkelijke figuurlijke betekenis:</div>
                      <div className="text-white font-bold">{result.idiomBreakdown.actualMeaning}</div>
                    </div>
                  </div>
                </div>

                {/* Cultural Origin / Etymology */}
                {result.idiomBreakdown.originOrEtymology && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Waarom zegt men dit zo? (Cultuurhistorische Herkomst):</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {result.idiomBreakdown.originOrEtymology}
                    </p>
                  </div>
                )}

                {/* False Friends Warning */}
                {result.idiomBreakdown.falseFriendsWarning && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1 shadow-2xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Pas op voor de Valse Vriend (False Friend / Faux Ami):</span>
                    </div>
                    <p className="leading-relaxed font-semibold">
                      {result.idiomBreakdown.falseFriendsWarning}
                    </p>
                  </div>
                )}

                {/* Authentic Usage Examples */}
                {result.idiomBreakdown.usageExamples && result.idiomBreakdown.usageExamples.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Voorbeelden in Authentieke Context:
                    </div>
                    <div className="space-y-2">
                      {result.idiomBreakdown.usageExamples.map((ex, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1">
                          <div className="font-bold text-slate-900 italic">
                            &quot;{ex.original}&quot;
                          </div>
                          <div className="text-slate-600 font-medium">
                            → {ex.dutch}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Retention Quiz for Languages */}
            {result.interactiveQuiz && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zelftest: Heb je het door? (+25 XP)</span>
                  </h4>
                  <span className="text-xs text-emerald-700 font-bold">Active Recall</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    {result.interactiveQuiz.question}
                  </div>

                  <div className="flex items-center gap-2">
                    {result.interactiveQuiz.hint && (
                      <button
                        type="button"
                        onClick={() => setQuizHintOpen(!quizHintOpen)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 border border-amber-200 rounded-md transition-colors flex items-center gap-1"
                      >
                        <span>{quizHintOpen ? 'Verberg hint' : '💡 Denkrichting'}</span>
                        {quizHintOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCheckQuizAnswer}
                      className="px-3 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>{quizAnswerOpen ? 'Verberg uitwerking' : '✓ Controleer antwoord (+25 XP)'}</span>
                      {quizAnswerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {quizHintOpen && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                      <span className="font-bold">Hint: </span>
                      <span>{result.interactiveQuiz.hint}</span>
                    </div>
                  )}

                  {quizAnswerOpen && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-1 animate-in fade-in duration-150 shadow-xs">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>VWO Modelantwoord & Grammaticale Verantwoording:</span>
                      </div>
                      <p className="leading-relaxed text-emerald-900">{result.interactiveQuiz.solution}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
};
