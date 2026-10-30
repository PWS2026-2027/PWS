export interface VwoSubject {
  id: string;
  name: string;
  category: 'Exact' | 'Maatschappij' | 'Talen' | 'Filosofie';
  profiles: string[];
}

export const VWO_SUBJECTS: VwoSubject[] = [
  // Talen
  { id: 'netl', name: 'Nederlands', category: 'Talen', profiles: ['NT', 'NG', 'EM', 'CM'] },
  { id: 'eng', name: 'Engels', category: 'Talen', profiles: ['NT', 'NG', 'EM', 'CM'] },
  { id: 'dui', name: 'Duits', category: 'Talen', profiles: ['CM', 'EM', 'NG', 'NT'] },
  { id: 'fra', name: 'Frans', category: 'Talen', profiles: ['CM', 'EM', 'NG', 'NT'] },
  // Exact
  { id: 'wisb', name: 'Wiskunde B', category: 'Exact', profiles: ['NT', 'NG'] },
  { id: 'wisa', name: 'Wiskunde A', category: 'Exact', profiles: ['EM', 'CM', 'NG'] },
  { id: 'nat', name: 'Natuurkunde', category: 'Exact', profiles: ['NT', 'NG'] },
  { id: 'sk', name: 'Scheikunde', category: 'Exact', profiles: ['NT', 'NG'] },
  { id: 'bio', name: 'Biologie', category: 'Exact', profiles: ['NG', 'NT'] },
  // Maatschappij
  { id: 'eco', name: 'Economie', category: 'Maatschappij', profiles: ['EM', 'CM'] },
  { id: 'ges', name: 'Geschiedenis', category: 'Maatschappij', profiles: ['CM', 'EM'] },
  { id: 'ak', name: 'Aardrijkskunde', category: 'Maatschappij', profiles: ['EM', 'CM', 'NG'] },
  { id: 'filo', name: 'Filosofie', category: 'Filosofie', profiles: ['CM', 'EM', 'NT', 'NG'] },
];

export interface VerifiedSource {
  name: string;
  domain: string;
  subjects: string[];
  description: string;
  whyTrust: string;
  badge: string;
}

export const VERIFIED_SOURCES: VerifiedSource[] = [
  {
    name: 'Examenblad.nl',
    domain: 'examenblad.nl',
    subjects: ['Alle vakken', 'Nederlands', 'Engels', 'Duits', 'Frans'],
    description: 'De officiële overheidssite van het College voor Toetsen en Examens (CvTE) met examensyllabi, formulebladen en correctievoorschriften.',
    whyTrust: 'Wettelijk bindende norm voor het Centraal Examen VWO in Nederland.',
    badge: 'Overheidsbron (CvTE)'
  },
  {
    name: 'Onze Taal & Woordenlijst.nl',
    domain: 'onzetaal.nl',
    subjects: ['Nederlands'],
    description: 'De officiële autoriteit van de Nederlandse Taalunie over spelling, grammatica, d/t-kwesties en stijlfouten.',
    whyTrust: 'Gezaghebbende taalkundige standaard voor het Nederlandse onderwijs en staatsinstellingen.',
    badge: 'Taalunie / Officiële Spelling'
  },
  {
    name: 'Cambridge English & Oxford Academic',
    domain: 'dictionary.cambridge.org',
    subjects: ['Engels'],
    description: 'Toonaangevend corpus voor academisch Engels, idiomatische collocations, CEFR C1/B2 niveaus en examenvocabulaire.',
    whyTrust: 'De wereldstandaard voor academisch Engels en CITO VWO-eindexamens.',
    badge: 'Universitair Engels Corpus'
  },
  {
    name: 'Duden & Deutsche Welle (DW)',
    domain: 'duden.de',
    subjects: ['Duits'],
    description: 'Het standaardnaslagwerk voor Duitse spelling, naamvallen (Kasus), voorzetsels en actuele VWO-tekstthemas.',
    whyTrust: 'De grondwet van de Duitse orthografie en grammatica.',
    badge: 'Duitse Taalnorm'
  },
  {
    name: 'Larousse & TV5Monde',
    domain: 'larousse.fr',
    subjects: ['Frans'],
    description: 'Franse woordenboeken, vervoegingstabellen (bescherelle), vaste uitdrukkingen en leesdossiers.',
    whyTrust: 'Officiële lexicografische standaard van de Franse taal.',
    badge: 'Franse Academische Norm'
  },
  {
    name: 'NEMO Kennislink',
    domain: 'nemokennislink.nl',
    subjects: ['Biologie', 'Scheikunde', 'Natuurkunde', 'Geschiedenis', 'Nederlands'],
    description: 'Toegankelijke wetenschapsjournalistiek geschreven door academici en wetenschappers, ondersteund door NWO.',
    whyTrust: 'Peer-reviewed wetenschappelijke inzichten vertaald naar middelbaar onderwijs niveau zonder verlies van diepgang.',
    badge: 'NWO / Wetenschapsarchief'
  },
  {
    name: 'KNAW (Koninklijke Nederlandse Akademie van Wetenschappen)',
    domain: 'knaw.nl',
    subjects: ['Alle profielen'],
    description: 'Het forum en de stem van de Nederlandse wetenschap, inclusief themadossiers en witboeken.',
    whyTrust: 'Het hoogste wetenschappelijke adviesorgaan van Nederland.',
    badge: 'Academische Top'
  },
  {
    name: 'Delpher Koninklijke Bibliotheek',
    domain: 'delpher.nl',
    subjects: ['Geschiedenis', 'Nederlands', 'Maatschappijleer'],
    description: 'Miljoenen gedigitaliseerde historische kranten, boeken en tijdschriften vanaf de 17e eeuw.',
    whyTrust: 'Primaire historische bronnen direct uit de archieven voor historisch brononderzoek.',
    badge: 'Primaire Historische Bron'
  },
  {
    name: 'CBS StatLine',
    domain: 'opendata.cbs.nl',
    subjects: ['Economie', 'Aardrijkskunde', 'Wiskunde A'],
    description: 'Officiële statistische database van het Centraal Bureau voor de Statistiek.',
    whyTrust: 'Nationale gouden standaard voor macro-economische, demografische en ruimtelijke data.',
    badge: 'Statistische Rijksinstantie'
  },
  {
    name: 'Binas Informatieboek',
    domain: 'noordhoff.nl/binas',
    subjects: ['Natuurkunde', 'Scheikunde', 'Biologie'],
    description: 'Hét officiële naslagwerk voor de exacte vakken op het VWO, met alle fysische constanten, tabellen en reactiemechanismen.',
    whyTrust: 'Toegestaan bij het centraal examen en samengesteld door de NVON.',
    badge: 'VWO Gouden Standaard'
  }
];

export const POPULAR_EXPLAINER_TOPICS = [
  {
    title: 'Het Bohr-effect & Zuurstoftransport',
    subject: 'Biologie',
    query: 'Leg het Bohr-effect uit: hoe beïnvloeden pH en CO2 de affiniteit van hemoglobine voor zuurstof in spierweefsel versus de longen?',
    tag: 'VWO 5/6 Cellulaire processen'
  },
  {
    title: 'D/T-spelling bij Engelse leenwoorden',
    subject: 'Nederlands',
    query: 'Waarom schrijf je "hij updatet" met een t, maar is het voltooid deelwoord "geüpdatet" en "gedeletet"? Leg de regels van het kofschip bij Engelse werkwoorden uit.',
    tag: 'VWO Nederlands Spelling'
  },
  {
    title: 'Elektromagnetische Inductie (Wet van Faraday & Lenz)',
    subject: 'Natuurkunde',
    query: 'Waarom veroorzaakt een veranderend magnetisch veld een inductiestroom en hoe verklaart de wet van Lenz de tegenwerking van de fluxverandering?',
    tag: 'VWO 5 Elektromagnetisme'
  },
  {
    title: 'Chemisch Evenwicht & Le Chatelier',
    subject: 'Scheikunde',
    query: 'Hoe verschuift een chemisch evenwicht bij volumeverkleining, temperatuurverhoging of toevoegen van een katalysator bij het Haber-Boschproces?',
    tag: 'VWO 4/5 Reactiekinetiek'
  },
  {
    title: 'Duitse Voorzetsels met 3e & 4e Naamval (Wechselpräpositionen)',
    subject: 'Duits',
    query: 'Hoe bepaal je bij an, auf, hinter, in, neben, über, unter, vor, zwischen of je de 3e (Dativ) of 4e naamval (Akkusativ) moet gebruiken? Leg het verschil uit tussen rust/positie (wo?) en beweging/richting (wohin?).',
    tag: 'VWO Duits Grammatica'
  },
  {
    title: 'Kettingregel & Buigpunten met e-machten',
    subject: 'Wiskunde B',
    query: 'Hoe vind je algebraïsch de buigpunten van de functie f(x) = (x^2 - 3) * e^(-2x) met behulp van de productregel en kettingregel?',
    tag: 'VWO 5 Differentiaalrekening'
  }
];

export const SAMPLE_HOMEWORK_ASSIGNMENTS = [
  {
    title: 'Natuurkunde: Schuine helling met wrijving',
    subject: 'Natuurkunde',
    text: `Opgave 24 (VWO 5):
Een kist met massa m = 4,0 kg bevindt zich op een helling met een hellingshoek van α = 35°.
De wrijvingscoëfficiënt tussen de kist en het hellingoppervlak is f = 0,25.
De zwaartekrachtversnelling is g = 9,81 m/s^2.
a) Bereken de normaalkracht die de helling uitoefent op de kist.
b) Bereken de versnelling van de kist als deze naar beneden glijdt.`,
    initialAttempt: 'Ik weet dat Fz = m * g = 4,0 * 9,81 = 39,24 N. Moet ik nu sin of cos gebruiken voor de normaalkracht?',
    previewImage: '/src/assets/images/homework_assignment_desk_1793370419324.jpg'
  },
  {
    title: 'Nederlands: Argumentatiestructuur & Drogredenen',
    subject: 'Nederlands',
    text: `Tekstanalyse VWO Examentekst:
In alinea 4 stelt de auteur: "Wie beweert dat kunstsubsidies moeten worden afgeschaft omdat de zorg tekorten heeft, begaat een fundamentele denkfout."
Vraag: Welke drogreden wijst de auteur hier aan en hoe verhoudt alinea 4 zich tot de hoofdstelling in alinea 1?`,
    initialAttempt: 'Volgens mij is dit een vals dilemma of een stroman, omdat er gedaan wordt alsof je moet kiezen tussen zorg en kunst. Maar hoe formuleer ik de alineafunctie volgens de CITO-termen?',
    previewImage: '/src/assets/images/language_study_desk_1793371067880.jpg'
  },
  {
    title: 'Engels: CITO C1 Tekst & Auteurshouding',
    subject: 'Engels',
    text: `CITO VWO Reading Exam - Paragraph 5:
"To argue that generative AI democratises artistic brilliance is to confuse widespread accessibility with genuine creative insight. The sheer velocity of automated output threatens to dilute rather than enrich the cultural fabric."
Question 18: What is the author's primary attitude towards AI-generated art in paragraph 5?
A) Enthusiastic endorsement
B) Reluctant acceptance
C) Deep-seated scepticism
D) Indifferent neutrality`,
    initialAttempt: 'Ik twijfel tussen B en C. De auteur zegt wel dat het accessible is, maar "threatens to dilute" klinkt negatief. Hoe sluit ik de foute antwoorden methodisch uit?',
    previewImage: '/src/assets/images/language_study_desk_1793371067880.jpg'
  },
  {
    title: 'Scheikunde: pH-berekening zwak zuur',
    subject: 'Scheikunde',
    text: `Opgave 12 (VWO 5/6):
Van azijnzuur (ethanzuur, CH3COOH) is de Kz = 1,7 · 10^-5 (298 K, Binas tabel 49).
Men heeft een oplossing met een azijnzuurconcentratie van 0,150 mol/L.
Bereken de pH van deze oplossing in 2 decimalen.`,
    initialAttempt: 'Ik dacht dat pH = -log(0,150) = 0,82, maar mijn docent zei dat azijnzuur een zwak zuur is en niet volledig splitst. Hoe stel ik de evenwichtsvoorwaarde op?',
    previewImage: '/src/assets/images/homework_assignment_desk_1793370419324.jpg'
  }
];

export const COGNITIVE_METHODS_EXPLAINED = [
  {
    id: 'spaced_repetition',
    name: 'Spaced Repetition & Ebbinghaus',
    shortName: 'Gespreide Herhaling',
    pioneers: 'Hermann Ebbinghaus / Piotr Wozniak',
    principle: 'Door informatie te herhalen op het exacte moment dat je het dreigt te vergeten, versterk je de synaptische plasticiteit (LTP - Long-Term Potentiation). De vergeetcurve vlakt exponentieel af na 3 herhalingen.',
    goldenIntervals: 'Dag 1 (encoding) → Dag 2 (24u check) → Dag 5 (consolidatie) → Dag 14 (langetermijnverankering)',
    vwoBenefit: 'Ideaal voor idioom, onregelmatige werkwoorden, Binas-begrippen en wiskundige definities.'
  },
  {
    id: 'retrieval_practice',
    name: 'Active Retrieval Practice (Testing Effect)',
    shortName: 'Actief Ophalen',
    pioneers: 'Roediger & Karpicke (2006)',
    principle: 'Het opnieuw lezen van een samenvatting creëert een "fluency illusion" (schijnzekerheid). Het actief ophalen van feiten uit het blote geheugen zonder te spieken triggert diepe neurale herstructurering.',
    goldenIntervals: 'Brain-dump op leeg papier vóórdat je het boek openslaat. Zelftoetsen vóórdat je je getoetst voelt.',
    vwoBenefit: 'Cruciaal voor VWO-inzichtsvragen en CITO-tekstbegrip waar je kennis moet toepassen in onbekende contexten.'
  },
  {
    id: 'feynman_technique',
    name: 'De Feynman Techniek',
    shortName: 'Feynman Uitleg',
    pioneers: 'Richard Feynman (Nobellaureaat Natuurkunde)',
    principle: 'Als je een theorie of grammaticaregel niet in eenvoudige taal zonder jargon kunt uitleggen aan een 12-jarige, begrijp je de eerste principes zelf nog niet. Jargon maskeert vaak kennishiaten.',
    goldenIntervals: 'Neem 1 complex concept → Leg het hardop of schriftelijk uit zonder vakjargon → Identificeer waar je vastloopt → Heropen de theorie.',
    vwoBenefit: 'Onmisbaar voor scheikundige reactiemechanismen, biologische fysiologie en complexe zinsconstructies.'
  },
  {
    id: 'dual_coding',
    name: 'Dual Coding Theorie',
    shortName: 'Dubbele Codering',
    pioneers: 'Allan Paivio (1971) / Caviglioli',
    principle: 'Ons werkgeheugen heeft twee gescheiden verwerkingskanalen: één voor verbale/tekstuele informatie en één voor visuele/ruimtelijke schema\'s. Als je beide gelijktijdig activeert, verdubbelt de opslagcapaciteit.',
    goldenIntervals: 'Teken altijd een beslisboom voor spellingsregels (dt/kofschip) of een krachtendiagram bij natuurkunde.',
    vwoBenefit: 'Voorkomt cognitieve overbelasting bij lange examenvraagstukken.'
  },
  {
    id: 'interleaving',
    name: 'Interleaving (Gevarieerd Oefenen)',
    shortName: 'Interleaving',
    pioneers: 'Robert Bjork (UCLA Learning Lab)',
    principle: 'Bloksgewijs oefenen (20 keer dezelfde regel) voelt makkelijk, maar faalt op examens. Interleaving mengt verschillende grammaticaregels of vraagtypen door elkaar zodat je leert herkennen WELKE regel van toepassing is.',
    goldenIntervals: 'Meng CITO-vragen over verschillende tekstsoorten en vraagtypen door elkaar.',
    vwoBenefit: 'Directe remedie tegen het klassieke examenprobleem: "Ik wist wel hoe de regel werkte, maar wist niet welke ik moest kiezen".'
  }
];

// Presets for the Language Coach
export interface LanguagePreset {
  language: 'Nederlands' | 'Engels' | 'Duits' | 'Frans';
  mode: 'reading_comprehension' | 'spelling_grammar' | 'idiom_vocabulary';
  title: string;
  query: string;
  badge: string;
}

export const LANGUAGE_PRESETS: LanguagePreset[] = [
  // Nederlands
  {
    language: 'Nederlands',
    mode: 'spelling_grammar',
    title: 'D/T-regels & Engelse werkwoorden',
    query: 'Waarom is het "hij deletet" en "geüpdatet" met een t, maar "hij downloadde" met dubbel d? Geef de exacte beslisboom volgens het Groene Boekje.',
    badge: 'Spelling VWO'
  },
  {
    language: 'Nederlands',
    mode: 'reading_comprehension',
    title: 'CITO Alineaverbanden & Signaalwoorden',
    query: 'Hoe herken je in een VWO-opinietekst het verschil tussen een "tegenwerping", een "weerlegging" en een "nuancering" aan de hand van signaalwoorden?',
    badge: 'Tekstbegrip CITO'
  },
  {
    language: 'Nederlands',
    mode: 'idiom_vocabulary',
    title: 'Vaste voorzetsels & contaminaties',
    query: 'Leg uit waarom "behorend tot" juist is maar "behorend bij" vaak fout wordt gerekend, en verklaar het verschil tussen "irriteren" en "zich ergeren aan".',
    badge: 'Stijl & Idioom'
  },

  // Engels
  {
    language: 'Engels',
    mode: 'reading_comprehension',
    title: 'Author Tone & Attitude in C1/VWO Texts',
    query: 'In CITO VWO reading exams, words like "dismissive", "condescending", "guarded", "reverent" and "sardonic" frequently appear in tone questions. Explain each attitude word with an authentic textual clue.',
    badge: 'Reading Exam'
  },
  {
    language: 'Engels',
    mode: 'spelling_grammar',
    title: 'Conditionals (Zero, 1st, 2nd, 3rd & Mixed)',
    query: 'Explain the difference between 2nd conditional ("If I knew, I would tell you") and 3rd conditional ("If I had known, I would have told you") and explain why "would have" never belongs in the if-clause.',
    badge: 'Grammar Precision'
  },
  {
    language: 'Engels',
    mode: 'idiom_vocabulary',
    title: 'De Verraderlijke "False Friends"',
    query: 'Verklaar de valse vrienden tussen Engels en Nederlands: "eventually" (niet eventueel), "actual" (niet actueel), "sympathetic" (niet sympathiek) en "billion" (niet biljart).',
    badge: 'False Friends Alert'
  },

  // Duits
  {
    language: 'Duits',
    mode: 'spelling_grammar',
    title: 'Wechselpräpositionen (3e vs 4e naamval)',
    query: 'Leg de 9 Wechselpräpositionen uit (an, auf, hinter, in, neben, über, unter, vor, zwischen): wanneer gebruik je Dativ (wo?) en wanneer Akkusativ (wohin?)?',
    badge: 'Grammatik / Kasus'
  },
  {
    language: 'Duits',
    mode: 'reading_comprehension',
    title: 'Signaalwoorden voor VWO CITO Duits',
    query: 'Welke signaalwoorden moet elke VWO-leerling kennen voor het CITO-examen Duits? Denk aan: allerdings, dennoch, zwar...aber, im Gegenteil, geschweige denn, folglich.',
    badge: 'Leseverstehen'
  },
  {
    language: 'Duits',
    mode: 'idiom_vocabulary',
    title: 'Vaste Duitse Redewendungen',
    query: 'Verklaar het Duitse idioom: "Schwein haben", "Die Flinte ins Korn werfen", "Klartext reden" en "Da liegt der Hund begraben". Waar komen ze vandaan en wat betekenen ze?',
    badge: 'Redewendungen'
  },

  // Frans
  {
    language: 'Frans',
    mode: 'spelling_grammar',
    title: 'Passé Composé vs Imparfait Beslisboom',
    query: 'Hoe kies je feilloos tussen de passé composé (afgeronde handeling in het verleden) en de imparfait (beschrijving, toestand, herhaalde gewoonte) bij Franse schrijf- en leestoetsen?',
    badge: 'Grammaire'
  },
  {
    language: 'Frans',
    mode: 'reading_comprehension',
    title: 'Mots charnières (Franse Signaalwoorden)',
    query: 'Verklaar de cruciale verbindingswoorden voor het Franse VWO-examen: cependant, en revanche, par conséquent, bien que (+ subjonctif), d\'ailleurs, ainsi.',
    badge: 'Compréhension Écrite'
  },
  {
    language: 'Frans',
    mode: 'idiom_vocabulary',
    title: 'Faux Amis & Franse Uitdrukkingen',
    query: 'Waarschuw voor Franse "faux amis": "attendre" (wachten, niet bijwonen), "actuellement" (nu, niet werkelijk), en leg het idioom uit: "poser un lapin" en "avoir le coup de foudre".',
    badge: 'Faux Amis & Idiome'
  }
];
