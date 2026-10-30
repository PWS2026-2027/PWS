export type VWOLevel = 'VWO 4' | 'VWO 5' | 'VWO 6 (Examenjaar)';

export type VWOProfile = 
  | 'Natuur & Techniek (NT)'
  | 'Natuur & Gezondheid (NG)'
  | 'Economie & Maatschappij (EM)'
  | 'Cultuur & Maatschappij (CM)';

export interface UserProfile {
  level: VWOLevel;
  profile: VWOProfile;
  favoriteSubjects: string[];
}

export interface AcademicSource {
  name: string;
  urlDescription: string;
  whyCredible: string;
}

export interface CheckQuestion {
  question: string;
  hint: string;
  answer: string;
}

export interface ExplainerResponse {
  summary: string;
  coreConcepts: string[];
  firstPrinciples: string;
  realWorldAnalogy: string;
  formulasOrMechanisms?: string;
  vwoContext?: string;
  academicSources: AcademicSource[];
  checkQuestions: CheckQuestion[];
}

export interface CognitivePrinciple {
  name: string;
  scientificEvidence: string;
  howToApply: string;
}

export interface ScheduleDay {
  dayOffset: number;
  phaseName: string;
  activities: string[];
  recommendedDurationMinutes: number;
}

export interface CredibleSourceItem {
  title: string;
  category: string;
  relevance: string;
  searchQueryOrLink: string;
}

export interface StudyStrategyResponse {
  cognitivePrinciples: CognitivePrinciple[];
  studySchedule: ScheduleDay[];
  credibleSources: CredibleSourceItem[];
  proTips: string[];
}

export interface SocraticResponse {
  transcription?: string;
  gegeven?: string[];
  gevraagd?: string;
  evaluationOfAttempt: string;
  socraticQuestion: string;
  conceptualHint?: string;
  isSolved: boolean;
  celebrationMessage?: string;
}

export interface FeynmanResponse {
  clarityScore: number;
  strengths: string[];
  gapsOrJargon: string[];
  actionableAdvice: string;
  feynmanIdealExplanation: string;
}

export interface SocraticMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: Partial<SocraticResponse>;
  timestamp: string;
}

// Language Coach Types
export type LanguageSubject = 'Nederlands' | 'Engels' | 'Duits' | 'Frans';
export type LanguageMode = 'reading_comprehension' | 'spelling_grammar' | 'idiom_vocabulary';

export interface ParagraphFunctionItem {
  paragraph: string;
  functionType: string;
  explanation: string;
}

export interface SignalWordItem {
  word: string;
  relation: string;
  impact: string;
}

export interface GrammarExampleItem {
  correct: string;
  incorrect: string;
  reason: string;
}

export interface IdiomUsageExample {
  original: string;
  dutch: string;
}

export interface LanguageAssistantResponse {
  language: LanguageSubject;
  mode: LanguageMode;
  mainTakeaway: string;
  readingAnalysis?: {
    mainIdea: string;
    paragraphFunctions: ParagraphFunctionItem[];
    signalWords: SignalWordItem[];
    toneAndStance: string;
    citoQuestionBreakdown?: {
      trap: string;
      correctLogic: string;
    };
  };
  grammarRule?: {
    ruleName: string;
    flowchartSteps: string[];
    mnemonicOrTrick: string;
    pitfalls: string[];
    exampleCorrectVsIncorrect: GrammarExampleItem[];
  };
  idiomBreakdown?: {
    expression: string;
    literalTranslation: string;
    actualMeaning: string;
    originOrEtymology: string;
    register: 'Formeel (Betoog/Brief)' | 'Neutraal' | 'Informeel';
    falseFriendsWarning?: string;
    usageExamples: IdiomUsageExample[];
  };
  interactiveQuiz: {
    question: string;
    hint: string;
    solution: string;
  };
}
