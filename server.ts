import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Helper to sanitize JSON response from Gemini
function cleanJsonResponse(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned;
}

// 1. Explainer API Endpoint
app.post('/api/explain', async (req, res) => {
  try {
    const { question, subject, level = 'VWO 5', contextMode = 'first_principles' } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Vraag is verplicht' });
      return;
    }

    const systemPrompt = `Je bent een academische toponderwijzer en coach voor Nederlandse VWO-bovenbouwleerlingen (${level}: VWO 4, 5 of 6).
Jouw doel: Geef een kristalheldere, wetenschappelijk accurate en diepgaande uitleg. VWO-leerlingen bereiden zich voor op de universiteit; behandel ze als nieuwsgierige toekomstige academici.
Vereisten:
1. Begin bij first principles (eerste principes / fundamentele natuurwetten, logische premissen of historische oorzaken).
2. Geef een levendige, intuïtieve analogie die het abstracte tastbaar maakt.
3. Bevat exacte formules, reactievergelijkingen of kernbegrippen (indien van toepassing op het vak: ${subject || 'Algemeen'}).
4. Noem verifieerbare, betrouwbare bronnen die specifiek relevant zijn voor het Nederlandse VWO (bijv. Binas tabellen, Examenblad syllabusdomeinen, KNAW, NEMO Kennislink, NWO, Universiteit Leiden/TU Delft/Utrecht, CBS, Delpher).
5. Bied 3 'Active Recall' testvragen met verborgen antwoorden, zodat de leerling de stof direct actief ophaalt uit het geheugen (cognitief bewezen leereffect).

Retourneer UITSLUITEND een geldig JSON-object met de volgende structuur:
{
  "summary": "Beknopte kernboodschap in 1-2 zinnen",
  "coreConcepts": ["Kernbegrip 1", "Kernbegrip 2", ...],
  "firstPrinciples": "Diepgaande uitleg vanuit het fundament en waarom het zo werkt",
  "realWorldAnalogy": "Een herkenbare, concrete analogie",
  "formulasOrMechanisms": "Relevante formules, wiskundige afleiding of stappenmechanisme (optioneel)",
  "vwoContext": "Hoe dit terugkomt in het VWO-examen / syllabus",
  "academicSources": [
    {
      "name": "Naam van bron (bijv. Binas tabel 35 of NEMO Kennislink)",
      "urlDescription": "Korte beschrijving van de betrouwbaarheid en waar te vinden",
      "whyCredible": "Waarom deze bron universitair/academisch geverifieerd is"
    }
  ],
  "checkQuestions": [
    {
      "question": "Uitdagende VWO-denkvraag",
      "hint": "Kleine denkrichting",
      "answer": "Het volledige beredeneerde antwoord"
    }
  ]
}`;

    const prompt = `Vak: ${subject || 'Algemeen VWO'}
Niveau: ${level}
Uitlegmodus: ${contextMode}
Vraag van scholier: ${question}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonResponse(response.text ?? '{}');
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({
      error: 'Er is een fout opgetreden bij het genereren van de uitleg.',
      details: error?.message || 'Onbekende fout',
    });
  }
});

// 2. Study Methods & Credible Sources API
app.post('/api/study-strategy', async (req, res) => {
  try {
    const { subject, topic, daysUntilExam = 7, currentStruggle, profile = 'Natuur & Techniek', level = 'VWO 5' } = req.body;

    const systemPrompt = `Je bent een expert in cognitieve psychologie en onderwijswetenschappen, gespecialiseerd in het Nederlandse VWO.
Je baseert je advies op wetenschappelijk bewezen leermethoden:
- Spaced Repetition (gespreide herhaling conform de Ebbinghaus-vergeetcurve)
- Active Retrieval Practice (het 'testing effect' - Roediger & Karpicke)
- Feynman-techniek (uitleggen in eigen woorden zonder jargon)
- Dual Coding (combinatie van verbale en visuele representaties)
- Interleaving (het afwisselen van vraagtypen i.p.v. bloksgewijs oefenen)
- Pomodoro & Ultradian Rhythms (focustijd vs diffuse modus)

Genereer een praktisch, wetenschappelijk onderbouwd studieplan voor de leerling.
Retourneer UITSLUITEND een geldig JSON-object:
{
  "cognitivePrinciples": [
    {
      "name": "Naam methode (bijv. Spaced Retrieval)",
      "scientificEvidence": "Waarom dit werkt volgens de cognitiewetenschap",
      "howToApply": "Hoe de scholier dit concreet toepast voor dit specifieke onderwerp"
    }
  ],
  "studySchedule": [
    {
      "dayOffset": 1,
      "phaseName": "Bijv. Actieve Encodering & Begripscheck",
      "activities": ["Stap 1...", "Stap 2..."],
      "recommendedDurationMinutes": 45
    }
  ],
  "credibleSources": [
    {
      "title": "Naam bron",
      "category": "Bijv. Examenstof / Universitaire database / Wetenschapsjournalistiek",
      "relevance": "Waarom dit betrouwbaarder is dan willekeurige websites/social media",
      "searchQueryOrLink": "Aanbevolen zoekterm of officiële portal (bijv. Examenblad.nl, NEMO Kennislink, KNAW, Delpher, CBS Statline)"
    }
  ],
  "proTips": ["Tip 1...", "Tip 2..."]
}`;

    const prompt = `Vak: ${subject}
Onderwerp: ${topic}
Dagen tot toets/examen: ${daysUntilExam} dagen
VWO Niveau: ${level}
Profiel: ${profile}
Waar de leerling tegenaan loopt: ${currentStruggle || 'Moeite om het langdurig te onthouden en toe te passen op examenniveau'}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonResponse(response.text ?? '{}');
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/study-strategy:', error);
    res.status(500).json({
      error: 'Kon geen studiemethode genereren.',
      details: error?.message || 'Onbekende fout',
    });
  }
});

// 3. Socratic Homework Helper API (Multimodal Image + Socratic Guidance)
app.post('/api/socratic-homework', async (req, res) => {
  try {
    const { imageBase64, imageMimeType = 'image/jpeg', problemText, studentAttempt, history = [], subject = 'Wiskunde/Natuurkunde', level = 'VWO 5' } = req.body;

    const systemPrompt = `Je bent "Socrates VWO", een begaafde en bemoedigende huiswerkcoach voor VWO 4-5-6 scholieren.
HET MEEST CRUCIALE PRINCIPE:
GEEF NOOIT HET DIRECTE EINDANTWOORD EN LOS DE OPGAVE NIET GELIJK OP!
Onderwijskundig onderzoek toont aan dat leerlingen alleen leren door zelf 'desirable difficulty' (gewenste wrijving) te ervaren en de denkstappen zelf te zetten.

Jouw taak:
1. Als er een afbeelding is: transcribeer nauwkeurig de opgave (Wat is Gegeven, Wat is Gevraagd?).
2. Analyseer de poging van de leerling:
   - Benoem wat er al HELEMAAL GOED is (positieve bekrachtiging).
   - Identificeer waar de denkfout of de hapering zit (conceptueel of rekenkundig).
3. Bied EEN gerichte Socratische vraag of subtiele Binas/formule hint die de leerling aanzet tot de volgende logische stap.
4. Houd de toon respectvol, scherp en inspirerend.
5. Als de leerling het na een aantal stappen zelfstandig goed heeft berekend of beredeneerd, bevestig dit dan trots ("Gefeliciteerd, je hebt hem zelf opgelost!") en geef een korte samenvatting van de gehanteerde oplosstrategie.

Retourneer UITSLUITEND een geldig JSON-object:
{
  "transcription": "Volledige tekst van de opgave (vooral bij afbeelding)",
  "gegeven": ["Gegeven variabele 1...", "Gegeven 2..."],
  "gevraagd": "Wat moet er precies berekend of beredeneerd worden?",
  "evaluationOfAttempt": "Wat doet de leerling goed en waar zit de knoop?",
  "socraticQuestion": "De krachtige vraag die de leerling zelf laat nadenken over de volgende stap",
  "conceptualHint": "Subtiele hint naar het achterliggende principe of relevante Binas-tabel",
  "isSolved": false,
  "celebrationMessage": ""
}`;

    const parts: any[] = [];

    if (imageBase64) {
      // Clean base64 prefix if present
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: cleanData,
        },
      });
    }

    let conversationContext = '';
    if (history.length > 0) {
      conversationContext = `Eerdere interactie:\n` + history.map((h: any) => `${h.role === 'user' ? 'Leerling' : 'Coach Socrates'}: ${h.content}`).join('\n\n') + '\n\n';
    }

    const textPrompt = `${conversationContext}
Vak: ${subject}
Niveau: ${level}
Opgavetekst (indien ingevoerd): ${problemText || 'Zie afbeelding'}
Huidige uitwerking/gedachte van de leerling: ${studentAttempt || 'Ik weet niet hoe ik moet beginnen'}`;

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonResponse(response.text ?? '{}');
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/socratic-homework:', error);
    res.status(500).json({
      error: 'Kon de opgave niet analyseren.',
      details: error?.message || 'Onbekende fout',
    });
  }
});

// 4. Feynman Technique Evaluator API
app.post('/api/feynman-evaluate', async (req, res) => {
  try {
    const { concept, studentExplanation, level = 'VWO 5' } = req.body;

    const systemPrompt = `Je bent een Feynman-expert voor VWO-scholieren.
De Feynman-techniek stelt: "Als je iets niet in eenvoudige woorden aan een leek kunt uitleggen, begrijp je het zelf nog niet diep genoeg."
Beoordeel de uitleg van de scholier over het concept "${concept}":
1. Heeft de scholier vaktermen gebruikt als 'schild' zonder te snappen wat ze betekenen?
2. Welke aannames kloppen, en waar zit een conceptueel hiaat?
3. Geef concrete feedback: hoe kan de scholier de uitleg nóg intuïtiever maken?
4. Schrijf een voorbeeld van hoe Richard Feynman of een VWO-topper dit zou verwoorden.

Retourneer UITSLUITEND JSON:
{
  "clarityScore": 85,
  "strengths": ["Sterk punt 1...", "Sterk punt 2..."],
  "gapsOrJargon": ["Plek waar jargon werd gebruikt of een denkfout zat..."],
  "actionableAdvice": "Hoe de scholier het kan verbeteren",
  "feynmanIdealExplanation": "Een kristalheldere voorbeeld-uitleg vol beeldspraak en eerste principes"
}`;

    const prompt = `Concept: ${concept}
Niveau: ${level}
Uitleg van scholier: ${studentExplanation}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonResponse(response.text ?? '{}');
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/feynman-evaluate:', error);
    res.status(500).json({
      error: 'Feynman evaluatie mislukt.',
      details: error?.message || 'Onbekende fout',
    });
  }
});

// 5. Language Assistant API Endpoint (Nederlands, Engels, Duits, Frans)
app.post('/api/language-assistant', async (req, res) => {
  try {
    const { language = 'Nederlands', mode = 'reading_comprehension', textOrQuery, contextQuestion, level = 'VWO 5' } = req.body;

    if (!textOrQuery || typeof textOrQuery !== 'string') {
      res.status(400).json({ error: 'Tekst of vraag is verplicht' });
      return;
    }

    const systemPrompt = `Je bent een meesterlijke taaldocent en examencoach voor de VWO-bovenbouw (${level}: VWO 4, 5 of 6) voor de taal: ${language}.
Je bent gespecialiseerd in:
1. Leesteksten uitleggen en CITO-tekstanalyses (hoofdgedachte, alineafuncties, signaalwoorden, auteurshouding/attitude, eliminatiemethode bij meerkeuzevragen).
2. Spellings- en grammaticaregels uitleggen met heldere stroomschema's (beslisbomen), 't kofschip/fokschaap, naamvallen (Kasus in Duits), conditionals in Engels, passé composé vs imparfait / subjonctif in Frans, en ezelsbruggetjes.
3. Idioom en vaste uitdrukkingen verklaren: letterlijke vs figuurlijke betekenis, cultuurhistorische herkomst, valse vrienden (false friends / faux amis) en formele schrijfstijl.

De taal van jouw uitleg is Nederlands, behalve de authentieke voorbeelden en citaten die in de doeltaal (${language}) staan.

Retourneer UITSLUITEND een geldig JSON-object:
{
  "language": "${language}",
  "mode": "${mode}",
  "mainTakeaway": "Krachtige kernconclusie in 1-2 zinnen",
  "readingAnalysis": {
    "mainIdea": "Hoofdgedachte van het tekstfragment",
    "paragraphFunctions": [
      {
        "paragraph": "Alinea 1/fragment",
        "functionType": "Bijv. Inleiding / Tegenwerping / Conclusie / Nuancering",
        "explanation": "Waarom deze alinea deze functie vervult"
      }
    ],
    "signalWords": [
      {
        "word": "Bijv. Toutefois / Allerdings / Whereas / Daarentegen",
        "relation": "Tegenstelling / Oorzaak-gevolg / Voorwaarde",
        "impact": "Wat dit betekent voor de redenering van de auteur"
      }
    ],
    "toneAndStance": "De toon van de auteur (bijv. kritisch, sceptisch, neutraal, ironisch) met bewijs uit de tekst",
    "citoQuestionBreakdown": {
      "trap": "Welke valkuil of afleider CITO vaak inbouwt bij dit soort vragen",
      "correctLogic": "Hoe je het juiste antwoord onweerlegbaar bewijst"
    }
  },
  "grammarRule": {
    "ruleName": "Naam van de regel (bijv. Wechselpräpositionen of D/T bij Engelse leenwoorden)",
    "flowchartSteps": [
      "Stap 1: Bepaal...",
      "Stap 2: Controleer...",
      "Stap 3: Concludeer..."
    ],
    "mnemonicOrTrick": "Het handigste ezelsbruggetje",
    "pitfalls": ["Valkuil 1...", "Valkuil 2..."],
    "exampleCorrectVsIncorrect": [
      {
        "correct": "Correct voorbeeld in ${language}",
        "incorrect": "Fout voorbeeld",
        "reason": "Waarom dit fout is volgens de grammatica"
      }
    ]
  },
  "idiomBreakdown": {
    "expression": "De uitdrukking of vaste constructie",
    "literalTranslation": "Letterlijke betekenis",
    "actualMeaning": "Werkelijke figuurlijke betekenis",
    "originOrEtymology": "Waarom men dit zo zegt (herkomst)",
    "register": "Formeel (Betoog/Brief)",
    "falseFriendsWarning": "Eventuele valse vriend (pas op: lijkt op Nederlands maar betekent iets anders)",
    "usageExamples": [
      {
        "original": "Voorbeeldzin in ${language}",
        "dutch": "Nederlandse vertaling"
      }
    ]
  },
  "interactiveQuiz": {
    "question": "Korte testvraag op VWO-examenniveau",
    "hint": "Kleine denkrichting",
    "solution": "Het volledige beredeneerde antwoord"
  }
}`;

    const prompt = `Taal: ${language}
Onderdeel: ${mode}
Niveau: ${level}
Invoer van scholier: ${textOrQuery}
${contextQuestion ? `Specifieke toetsvraag / context: ${contextQuestion}` : ''}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonResponse(response.text ?? '{}');
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/language-assistant:', error);
    res.status(500).json({
      error: 'Kon taalvraag niet verwerken.',
      details: error?.message || 'Onbekende fout',
    });
  }
});

// Mount Vite or serve static assets
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VWO Mentor server draait op poort ${PORT}`);
});
