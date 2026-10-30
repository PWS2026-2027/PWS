import React, { useState, useRef } from 'react';
import { UserProfile, SocraticMessage, SocraticResponse } from '../types';
import { SAMPLE_HOMEWORK_ASSIGNMENTS, VWO_SUBJECTS } from '../data/vwoData';
import {
  Camera,
  Upload,
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileText,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Check,
  Bot,
  Zap,
  Flame,
  Award
} from 'lucide-react';

interface HomeworkHelperViewProps {
  profile: UserProfile;
  onAddXP?: (amount: number, reason: string) => void;
}

export const HomeworkHelperView: React.FC<HomeworkHelperViewProps> = ({ profile, onAddXP }) => {
  const [selectedSubject, setSelectedSubject] = useState(profile.favoriteSubjects[0] || 'Natuurkunde');
  const [problemText, setProblemText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState('image/jpeg');

  // Socratic dialogue state
  const [messages, setMessages] = useState<SocraticMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState(1);
  const [isSolved, setIsSolved] = useState(false);

  // Scratchpad
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Kies een geldige afbeelding (.jpg, .png, etc.)');
      return;
    }

    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setImagePreview(result);
      onAddXP?.(20, 'Opgave gescand met Socrates Bot');
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = (sample: typeof SAMPLE_HOMEWORK_ASSIGNMENTS[0]) => {
    setSelectedSubject(sample.subject);
    setProblemText(sample.text);
    setImagePreview(sample.previewImage);
    setImageBase64(null);
    setMessages([]);
    setIsSolved(false);
    setStepCount(1);
    setStudentInput(sample.initialAttempt);
    onAddXP?.(15, 'Voorbeeldopgave ingeladen');
  };

  const handleStartAnalysis = async () => {
    if (!problemText.trim() && !imageBase64 && !imagePreview) {
      setError('Voer een opgave in of scan een foto van je huiswerk.');
      return;
    }

    setLoading(true);
    setError(null);

    const initialAttempt = studentInput.trim() || 'Ik heb de opgave bekeken, maar weet niet goed hoe te beginnen.';

    const initialUserMsg: SocraticMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: initialAttempt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [initialUserMsg];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/socratic-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64,
          imageMimeType: imageMimeType,
          problemText: problemText || (imagePreview ? 'Opgave zichtbaar op scan' : ''),
          studentAttempt: initialAttempt,
          history: [],
          subject: selectedSubject,
          level: profile.level,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Kon huiswerkhulp niet starten');
      }

      const data: SocraticResponse = await res.json();

      const assistantMsg: SocraticMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.socraticQuestion,
        data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newMessages, assistantMsg]);
      setStudentInput('');
      setStepCount(1);
      if (data.isSolved) {
        setIsSolved(true);
        onAddXP?.(100, '🏆 Opgave direct zelfstandig opgelost!');
      } else {
        onAddXP?.(25, 'Socratische sessie gestart');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Er is een fout opgetreden.');
    } finally {
      setLoading(false);
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const attempt = studentInput.trim();
    if (!attempt || loading) return;

    const userMsg: SocraticMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: attempt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setStudentInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/socratic-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: problemText,
          studentAttempt: attempt,
          history: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          subject: selectedSubject,
          level: profile.level,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Fout bij analyseren van jouw stap');
      }

      const data: SocraticResponse = await res.json();

      const assistantMsg: SocraticMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.socraticQuestion,
        data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...updatedHistory, assistantMsg]);
      setStepCount((prev) => prev + 1);
      if (data.isSolved) {
        setIsSolved(true);
        onAddXP?.(100, '🎉 Opgave Zelfstandig Gekraakt! (+100 XP)');
      } else {
        onAddXP?.(30, 'Denkstap gezet met Socrates (+30 XP)');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Kon antwoord niet verwerken');
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleReset = () => {
    setProblemText('');
    setImageBase64(null);
    setImagePreview(null);
    setMessages([]);
    setStudentInput('');
    setIsSolved(false);
    setStepCount(1);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner: Socrates Bot */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <img
          src="/src/assets/images/homework_assignment_desk_1793370419324.jpg"
          alt="Vakwerk opgave met wiskundige en natuurkundige berekeningen"
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <span className="bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-md border border-sky-400/30">
                🤖 Socrates Bot
              </span>
              <span aria-hidden="true">·</span>
              <span>Huiswerkhulp & Scanner</span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400">{profile.level}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              Scan je opgave & ontdek zélf de sleutel.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kant-en-klare antwoorden kopiëren helpt je niet op de toets.
              Socrates Bot stelt de juiste richtinggevende vragen en geeft subtiele hints,
              zodat jij het eureka-gevoel ervaart én het echt onthoudt.
            </p>
          </div>
        </div>
      </div>

      {/* Input Deck: Scanner & Assignment Setup */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-sky-600" />
              <span>Stap 1: Opgave invoeren of scannen</span>
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-bold">Vak:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5 font-bold text-sky-900 text-xs cursor-pointer focus:ring-2 focus:ring-sky-500"
              >
                {VWO_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scanner / Upload area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Scan Uploader */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center text-[11px]">A</span>
                <span>Scan / Foto van schrift of boek</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Voorbeeld van scan"
                      className="max-h-32 rounded-lg object-contain mx-auto border border-slate-200 shadow-xs"
                    />
                    <div className="text-xs text-sky-700 font-bold">
                      ✓ Foto geladen. Klik om te wijzigen.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Upload foto of sleep afbeelding hierheen
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Geschikt voor handgeschreven sommen, grafieken en Binas-opgaven
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input Option */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center text-[11px]">B</span>
                <span>Of typ / plak de opgavetekst</span>
              </label>
              <textarea
                rows={6}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Plak hier de tekst van de opgave (bijv: Opgave 24: Een kist met massa m = 4,0 kg glijdt langs een helling van 35 graden...)"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 font-mono leading-relaxed resize-none font-medium"
              />
            </div>
          </div>

          {/* Student's initial attempt / thought */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>Jouw eerste denkstap of berekening (Waar loop je vast?)</span>
            </label>
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder="Bijv: Ik heb Fz = m*g berekend, maar twijfel tussen sin en cos voor de normaalkracht..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          {/* Preset Sample Assignments */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct testen met een VWO-voorbeeldomgeving:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_HOMEWORK_ASSIGNMENTS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(s)}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-sky-50/60 hover:border-sky-300 text-left transition-colors"
                >
                  <div className="font-bold text-xs text-sky-900 truncate">{s.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{s.text}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={loading || (!problemText.trim() && !imageBase64 && !imagePreview)}
              className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-sky-200"
            >
              {loading ? (
                <span>Opgave analyseren...</span>
              ) : (
                <>
                  <span>Start Socratische Coaching (+25 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Socratic Active Conversation Deck */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Flow */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-indigo-50/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Socrates Bot</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Stap {stepCount} · {selectedSubject} · {profile.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScratchpadOpen(!scratchpadOpen)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors"
                >
                  📝 Kladblok {scratchpadOpen ? '▲' : '▼'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Opnieuw</span>
                </button>
              </div>
            </div>

            {/* Scratchpad Collapsible */}
            {scratchpadOpen && (
              <div className="p-3.5 bg-amber-50/70 border-b border-amber-200 text-xs">
                <div className="font-bold text-amber-950 mb-1">Jouw Kladblok / Tussenberekeningen:</div>
                <textarea
                  rows={3}
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Noteer hier formules, tussenwaarden of Binas-tabelnummers..."
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[11px] text-slate-400 mb-1 font-medium">
                      {isAssistant ? 'Socrates Bot' : 'Jij'} · {msg.timestamp}
                    </div>

                    <div
                      className={`max-w-[90%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-50 border border-slate-200 text-slate-900 space-y-3'
                          : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium shadow-xs'
                      }`}
                    >
                      {isAssistant && msg.data ? (
                        <>
                          {/* Evaluation of attempt */}
                          {msg.data.evaluationOfAttempt && (
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                                <span>Feedback op jouw gedachte:</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {msg.data.evaluationOfAttempt}
                              </p>
                            </div>
                          )}

                          {/* Socratic Question */}
                          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-950 font-medium">
                            <div className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-1 flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5 text-sky-600" />
                              <span>Volgende Socratische Vraag:</span>
                            </div>
                            <p className="leading-relaxed font-semibold">{msg.data.socraticQuestion}</p>
                          </div>

                          {/* Conceptual / Binas Hint */}
                          {msg.data.conceptualHint && (
                            <div className="text-xs text-amber-950 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-900">Binas / Formule Hint: </span>
                                <span className="font-medium">{msg.data.conceptualHint}</span>
                              </div>
                            </div>
                          )}

                          {/* Solved Celebration */}
                          {msg.data.isSolved && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-950 space-y-2 shadow-xs">
                              <div className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-800">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span>🏆 Gefeliciteerd! Zelfstandig Opgelost! (+100 XP)</span>
                              </div>
                              <p className="text-xs font-medium">
                                {msg.data.celebrationMessage ||
                                  'Je hebt deze VWO-opgave helemaal zelf beredeneerd door de denkstappen stap voor stap uit te voeren.'}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold p-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
                  <span>Socrates Bot analyseert jouw redenering...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendNextStep} className="p-4 border-t border-slate-100 bg-slate-50/60">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  placeholder={
                    isSolved
                      ? 'De opgave is opgelost! Wil je nog een tussenstap evalueren?'
                      : 'Typ hier jouw volgende berekening of beredenering...'
                  }
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !studentInput.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Stuur stap</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar: Gegeven & Gevraagd Overview + Assignment Preview */}
          <div className="space-y-4">
            {/* Problem card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Opgave Context</span>
              </h3>

              {imagePreview && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Scan van opgave"
                    className="w-full max-h-40 object-contain bg-slate-950"
                  />
                </div>
              )}

              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {problemText || 'Zie afbeelding hierboven'}
              </div>
            </div>

            {/* Gegeven & Gevraagd structured tracker */}
            {(() => {
              const firstAssistant = messages.find((m) => m.role === 'assistant' && m.data);
              const data = firstAssistant?.data;
              if (!data) return null;

              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Syllabus Analyse
                  </h3>

                  {data.gegeven && data.gegeven.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">Gegeven:</div>
                      <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5 font-medium">
                        {data.gegeven.map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.gevraagd && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-800">Gevraagd:</div>
                      <p className="text-xs text-slate-600 font-medium">{data.gevraagd}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Socratic rule reminder */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-sky-900">
                <BookOpen className="w-4 h-4 text-sky-700" />
                <span>Waarom Socratisch?</span>
              </div>
              <p className="leading-relaxed text-sky-900 font-medium">
                Als je zelf ontdekt waarom een formule past, verankert het in je langetermijngeheugen.
                Socrates helpt je de finish over!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
