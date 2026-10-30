import React, { useState } from 'react';
import { UserProfile, FeynmanResponse } from '../types';
import {
  Brain,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Scissors,
  Zap,
  Flame
} from 'lucide-react';

interface FeynmanSandboxViewProps {
  profile: UserProfile;
  onAddXP?: (amount: number, reason: string) => void;
}

const PRESET_FEYNMAN_CONCEPTS = [
  {
    subject: 'Biologie',
    concept: 'Osmose & Waterpotentiaal',
    prompt: 'Leg uit waarom een plantencel niet knapt in gedestilleerd water (turgor) maar een rode bloedcel wel (hemolyse).'
  },
  {
    subject: 'Natuurkunde',
    concept: 'Het Foto-elektrisch Effect',
    prompt: 'Leg uit waarom het uittreden van elektronen afhangt van de frequentie van het licht en niet van de lichtintensiteit.'
  },
  {
    subject: 'Scheikunde',
    concept: 'Dynamisch Chemisch Evenwicht',
    prompt: 'Leg uit waarom bij een evenwichtsreactie de heengaande en teruggaande reacties niet stilstaan, hoewel de concentraties constant lijken.'
  },
  {
    subject: 'Wiskunde B',
    concept: 'De Afgeleide & Richtingscoëfficiënt',
    prompt: 'Leg uit wat een afgeleide f\'(x) intuïtief betekent met behulp van een snelheidsmeter in een rijdende auto.'
  },
  {
    subject: 'Economie',
    concept: 'Prijselasticiteit van de Vraag',
    prompt: 'Leg uit waarom de omzet van insulinefabrikanten nauwelijks daalt bij prijsverhoging, maar bij vliegretourtjes wel.'
  }
];

export const FeynmanSandboxView: React.FC<FeynmanSandboxViewProps> = ({ profile, onAddXP }) => {
  const [concept, setConcept] = useState('Osmose & Waterpotentiaal');
  const [studentExplanation, setStudentExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FeynmanResponse | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || !studentExplanation.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/feynman-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept,
          studentExplanation,
          level: profile.level,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Feynman evaluatie mislukt');
      }

      const data: FeynmanResponse = await res.json();
      setResult(data);
      onAddXP?.(50, `JargonBuster test geslaagd met ${data.clarityScore}/100!`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Er ging iets mis bij de analyse.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (item: typeof PRESET_FEYNMAN_CONCEPTS[0]) => {
    setConcept(item.concept);
    setStudentExplanation('');
    setResult(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner: JargonBuster */}
      <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
            <span className="bg-fuchsia-500/20 text-fuchsia-300 px-2.5 py-0.5 rounded-md border border-fuchsia-400/30">
              ✂️ JargonBuster
            </span>
            <span aria-hidden="true">·</span>
            <span>De Feynman Begripstest</span>
            <span aria-hidden="true">·</span>
            <span className="text-fuchsia-400">{profile.level}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            &quot;Als je het niet eenvoudig kunt uitleggen, begrijp je het zelf nog niet.&quot;
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            VWO-leerlingen verstoppen zich vaak achter moeilijke termen zonder te weten wat er écht gebeurt.
            JargonBuster analyseert jouw uitleg, prikt door holle vaktermen heen en toont precies waar je begrip nog hapert.
          </p>

          {/* Preset Concept Chips */}
          <div className="pt-2">
            <div className="text-xs font-bold text-fuchsia-300 mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Kies een concept om te ontmaskeren:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_FEYNMAN_CONCEPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(item)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition-all text-left ${
                    concept === item.concept
                      ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
                  }`}
                >
                  <span className="text-fuchsia-300">{item.subject}: </span>
                  <span>{item.concept}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleEvaluate} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-fuchsia-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Het te verklaren concept</span>
          </label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Bijv. Elektromagnetische inductie of Het verschil tussen Meiose I en II"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-500"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-fuchsia-600 text-white flex items-center justify-center text-[11px]">2</span>
              <span>Jouw uitleg in gewone mensentaal</span>
            </label>
            <span className="text-[11px] text-fuchsia-700 font-semibold bg-fuchsia-50 px-2 py-0.5 rounded">
              Zonder vaktermen!
            </span>
          </div>
          <textarea
            rows={6}
            value={studentExplanation}
            onChange={(e) => setStudentExplanation(e.target.value)}
            placeholder="Leg het uit alsof je het vertelt aan je nieuwsgierige buurjongen van 12. Waarom gebeurt dit? Welke alledaagse vergelijking maakt het logisch?"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 leading-relaxed placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 font-medium"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-semibold text-slate-500">
            {studentExplanation.trim().split(/\s+/).filter(Boolean).length} woorden ingevoerd
          </div>
          <button
            type="submit"
            disabled={loading || !concept.trim() || !studentExplanation.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-fuchsia-200"
          >
            {loading ? (
              <span>Jargon scannen...</span>
            ) : (
              <>
                <span>Bust My Jargon (+50 XP)</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Evaluation Results */}
      {result && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                JargonBuster Eindrapport
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Voor concept: <span className="font-bold text-slate-900">{concept}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase font-bold">Helderheidsscore</div>
                <div className="text-2xl font-mono font-extrabold text-fuchsia-600">
                  {result.clarityScore} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {result.strengths && result.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Wat je intuïtief al heel goed uitlegt:</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1 pl-1 list-disc list-inside font-medium">
                {result.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Jargon & Gaps */}
          {result.gapsOrJargon && result.gapsOrJargon.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Geïdentificeerd Jargon of Conceptuele Hiaten:</span>
              </div>
              <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside font-medium">
                {result.gapsOrJargon.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Advice */}
          {result.actionableAdvice && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Concrete verbetersuggestie:
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {result.actionableAdvice}
              </p>
            </div>
          )}

          {/* Feynman Ideal Explanation Model */}
          {result.feynmanIdealExplanation && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 space-y-2">
              <div className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Hoe Richard Feynman dit kristalhelder zou uitleggen:</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950 leading-relaxed italic font-medium">
                &quot;{result.feynmanIdealExplanation}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
