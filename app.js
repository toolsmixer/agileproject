const { useEffect, useMemo, useRef, useState } = React;

const backend = window.createBackend();

const tiles = [
  { id: "poker-planning", active: true, icon: "PP" },
  { id: "game-tools", active: true, icon: "GT" },
  { id: "retro", active: false, icon: "RB" },
  { id: "standup", active: false, icon: "SF" },
];
const GAME_TOOL_IDS = ["wheel-of-name", "wave-length", "buzzer"];

const reactionIcons = {
  yourock: "icons/icon-yourock.png",
  disagree: "icons/icon-disagree.png",
  tired: "icons/icon-tired.png",
};

const WHEEL_COLORS = ["#ff8f66", "#ffc36b", "#f4e285", "#9ed2a9", "#86c5f4", "#9f9ff6", "#d8a3eb", "#f09daf"];
const DEFAULT_WHEEL_NAMES = ["Alex", "Sam", "Jordan", "Taylor"];
const DEFAULT_BUZZER_PLAYERS = ["Alex", "Sam", "Jordan", "Taylor"];
const WAVE_PROMPTS = {
  en: [
    "Most energizing sprint ceremony",
    "Most useful retrospective format",
    "Most stressful release day moment",
    "Most underrated team habit",
    "Best snack for long workshops",
  ],
  fr: [
    "Ceremonie sprint la plus energisante",
    "Format de retrospective le plus utile",
    "Moment de release le plus stressant",
    "Habitude d'equipe la plus sous-estimee",
    "Meilleur snack pour un long atelier",
  ],
};

const STORAGE_KEYS = {
  userId: "scrum_user_id",
  userName: "scrum_user_name",
};

const SUPPORT_LINK = "https://buy.stripe.com/your-link";

const LANGUAGE_STORAGE_KEY = "scrum_language";

const translations = {
  en: {
    languageLabel: "Language",
    languageNames: { en: "English", fr: "French" },
    home: {
      title: "Agile Scrum Master Toolkit",
      tag: "Control Room",
      lede:
        "A lightweight set of focused tools for Scrum Masters. Launch an app, keep the ceremony moving, and stay aligned.",
      start: "Start a planning session",
      toolsLabel: "Agile tools",
      footer: "Built for GitHub Pages. Add new tiles as your toolkit grows.",
    },
    tiles: {
      "poker-planning": {
        title: "Poker Planning",
        description: "Run quick estimation rounds with Fibonacci-based cards.",
        cta: "Open tool",
      },
      "game-tools": {
        title: "Game tools",
        description: "Open a game hub with Wheel of Name, Wave Length, and Buzzer.",
        cta: "Open tool",
      },
      "wheel-of-name": {
        title: "Wheel of Name",
        description: "Add names, spin the wheel, and pick a random person.",
        cta: "Open tool",
      },
      "wave-length": {
        title: "Wave Length",
        description: "Set a hidden target on a scale and see how close the team's guess gets.",
        cta: "Open tool",
      },
      buzzer: {
        title: "Buzzer",
        description: "First person to buzz is locked in and highlighted for the answer.",
        cta: "Open tool",
      },
      retro: {
        title: "Retro board",
        description: "Collect highlights, lowlights, and ideas in one space.",
        cta: "Coming soon",
      },
      standup: {
        title: "Standup focus",
        description: "Keep daily updates clear and timeboxed.",
        cta: "Coming soon",
      },
    },
    menu: {
      home: "Home menu",
      session: "Session",
      settings: "Settings",
      openSession: "Open session menu",
      closeSession: "Close session menu",
      openSettings: "Open settings menu",
      closeSettings: "Close settings menu",
    },
    poker: {
      title: "Poker Planing",
      startJoin: "Start or join a session",
      shareTip: "Share the room code with your team once you create it.",
    },
    wheel: {
      title: "Wheel of Name",
      intro: "Add names, remove names, then spin to pick one at random.",
      addLabel: "Add a name",
      addPlaceholder: "Type a name",
      addButton: "Add name",
      spin: "Spin wheel",
      spinning: "Spinning...",
      remove: "Remove",
      removeName: "Remove {name}",
      namesTitle: "Names",
      namesEmpty: "No names yet. Add at least two to spin.",
      winner: "Selected: {name}",
      enterName: "Enter a name before adding.",
      duplicateName: "That name is already on the wheel.",
      needMoreNames: "Add at least two names to spin the wheel.",
    },
    gameTools: {
      title: "Game tools",
      intro: "Choose a game from this menu and launch it.",
      selectLabel: "Choose a game tool",
    },
    wave: {
      title: "Wave Length",
      intro: "Use the hidden target and the clue to spark debate. Reveal and compare the guess.",
      promptLabel: "Prompt",
      guessLabel: "Team guess",
      lowLabel: "Low",
      highLabel: "High",
      reveal: "Reveal target",
      hide: "Hide target",
      newRound: "New round",
      target: "Target: {value}",
      distance: "Distance: {value}",
    },
    buzzer: {
      title: "Buzzer",
      intro: "Add participants and start a round. The first buzz is locked and highlighted.",
      playersTitle: "Players",
      addLabel: "Add a player",
      addPlaceholder: "Type a player name",
      addButton: "Add player",
      empty: "No players yet. Add at least two players.",
      buzzNow: "Buzz now",
      reset: "Reset round",
      winner: "First buzz: {name}",
      waiting: "Waiting for first buzz",
      enterPlayer: "Enter a player name before adding.",
      duplicatePlayer: "That player already exists.",
    },
    labels: {
      yourName: "Your pseudo",
      roomCode: "Room code",
      shareLink: "Share link",
      qrCode: "QR code",
      yourPick: "Your pick",
      anonymous: "Anonymous",
    },
    placeholders: {
      name: "Pseudo used for votes",
      roomCode: "ABC123",
      supabaseUrl: "https://YOUR_PROJECT.supabase.co",
      supabaseKey: "Your anon public key",
    },
    actions: {
      startPlanning: "Start a planning session",
      createRoom: "Create new room",
      joinRoom: "Join room",
      revealVotes: "Reveal votes",
      resetVotes: "Reset votes",
      leaveRoom: "Leave room",
      copyLink: "Copy link",
      saveReload: "Save and reload",
      close: "Close",
    },
    status: {
      revealed: "Revealed",
      hidden: "Hidden",
      votesCount: "Votes {voted}/{total}",
      waiting: "Waiting",
      voted: "Voted",
      noVote: "No vote",
    },
    table: {
      title: "Estimation table",
      waitingEmpty: "Waiting for teammates",
      roomLabel: "Room {id}",
      votesCount: "Votes {voted}/{total}",
      average: "Average: {value}",
      strike: "Striiiiike",
    },
    card: {
      title: "Pick a card",
      help: "Your selection stays hidden until the reveal.",
      none: "No card yet",
    },
    views: {
      table: "Around table",
      list: "List view",
    },
    privacy: {
      title: "Privacy",
      intro: "This page explains the minimum data we handle to run poker planning sessions.",
      dataTitle: "Session data",
      dataBody:
        "We store your pseudo, your vote, and the room code in Supabase so the session can work. This data is visible to anyone who has the room link.",
      localTitle: "Local storage",
      localBody:
        "We store a random user id, your pseudo, and your language preference in your browser local storage.",
      sharingTitle: "Sharing",
      sharingBody: "Anyone with the room link can join and see the session data.",
      contactTitle: "Contact",
      contactBody: "Questions? Email straoss.inc@gmail.com.",
    },
    tooltips: {
      youRock: "You rock teams",
      disagree: "Disagree",
      tired: "Tired",
    },
    session: {
      title: "Session {id}",
      shareHint: "Send the link or share the QR code below.",
      defaultName: "Session {id}",
    },
    setup: {
      title: "Supabase setup",
      description: "Enter your project URL and anon key. This is saved only in your browser.",
      url: "Supabase URL",
      anonKey: "Anon key",
    },
    settings: {
      title: "Settings",
      deckTitle: "Card values",
      deckHelp: "Enter values separated by commas.",
      deckPlaceholder: "0, 0.5, 1, 2, 3, 5, 8, 13, 21, ?, Pause",
      updateDeck: "Update deck",
      resetDeck: "Reset to default",
      rangeTitle: "Generate range",
      rangeHelp: "Set min, max, and step to build a sequence.",
      min: "Min",
      max: "Max",
      step: "Step",
      includeQuestion: "Include ?",
      includeBreak: "Include Break",
      applyRange: "Apply range",
    },
    support: {
      title: "Support",
      blurb: "If Poker Planning helped your session, you can support its development.",
      button: "Support Poker Planning",
      note: "Totally optional. The app remains free.",
    },
    notices: {
      enterName: "Please enter your pseudo to continue.",
      supabaseNotConfigured: "Supabase is not configured yet.",
      createFailed: "Unable to create room.",
      joinFailed: "Unable to join room.",
      sessionClosed: "Session Closed, please create a new Session",
      enterRoom: "Enter a room code to join.",
      submitVoteFailed: "Unable to submit vote.",
      revealFailed: "Unable to reveal votes.",
      resetFailed: "Unable to reset votes.",
      reactionFailed: "Unable to update reaction.",
      invalidRange: "Enter a valid min, max, and step.",
      emptyDeck: "Deck cannot be empty.",
      updateDeckFailed: "Unable to update deck.",
      linkCopied: "Link copied.",
      copyFailed: "Unable to copy link.",
    },
    notFound: {
      title: "Page not found",
      body: "That route does not exist yet. Head back to the toolkit.",
      backHome: "Back home",
    },
    tip: "Tip: ask everyone to join before revealing votes.",
    qr: {
      hint: "Scan to join this room",
    },
    deck: ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "?", "Break"],
    cardLabels: { Break: "Break", Pause: "Break" },
  },
  fr: {
    languageLabel: "Langue",
    languageNames: { en: "Anglais", fr: "Francais" },
    home: {
      title: "Boite a outils Scrum Master Agile",
      tag: "Salle de controle",
      lede:
        "Un ensemble d'outils legers pour les Scrum Masters. Lancez une app, gardez la ceremonie fluide, et restez alignes.",
      start: "Demarrer une session de planning",
      toolsLabel: "Outils agiles",
      footer: "Construit pour GitHub Pages. Ajoutez de nouveaux outils quand vous voulez.",
    },
    tiles: {
      "poker-planning": {
        title: "Planning poker",
        description: "Lancez des estimations rapides avec des cartes Fibonacci.",
        cta: "Ouvrir",
      },
      "game-tools": {
        title: "Outils de jeu",
        description: "Ouvrez un hub de jeu avec Roue des noms, Wave Length et Buzzer.",
        cta: "Ouvrir",
      },
      "wheel-of-name": {
        title: "Roue des noms",
        description: "Ajoutez des noms, lancez la roue, et tirez une personne au hasard.",
        cta: "Ouvrir",
      },
      "wave-length": {
        title: "Wave Length",
        description: "Definissez une cible cachee sur une echelle et mesurez la proximite de l'equipe.",
        cta: "Ouvrir",
      },
      buzzer: {
        title: "Buzzer",
        description: "La premiere personne qui buzz est verrouillee et mise en evidence.",
        cta: "Ouvrir",
      },
      retro: {
        title: "Tableau retro",
        description: "Collectez les points forts, points faibles et idees au meme endroit.",
        cta: "Bientot",
      },
      standup: {
        title: "Focus daily",
        description: "Gardez les points quotidiens clairs et cadences.",
        cta: "Bientot",
      },
    },
    menu: {
      home: "Menu principal",
      session: "Session",
      settings: "Parametres",
      openSession: "Ouvrir le menu session",
      closeSession: "Fermer le menu session",
      openSettings: "Ouvrir le menu parametres",
      closeSettings: "Fermer le menu parametres",
    },
    poker: {
      title: "Planning poker",
      startJoin: "Demarrer ou rejoindre une session",
      shareTip: "Partagez le code de session avec votre equipe apres creation.",
    },
    wheel: {
      title: "Roue des noms",
      intro: "Ajoutez des noms, retirez des noms, puis lancez la roue pour un tirage aleatoire.",
      addLabel: "Ajouter un nom",
      addPlaceholder: "Entrez un nom",
      addButton: "Ajouter",
      spin: "Lancer la roue",
      spinning: "La roue tourne...",
      remove: "Retirer",
      removeName: "Retirer {name}",
      namesTitle: "Noms",
      namesEmpty: "Aucun nom pour le moment. Ajoutez-en au moins deux.",
      winner: "Selection: {name}",
      enterName: "Entrez un nom avant d'ajouter.",
      duplicateName: "Ce nom est deja dans la roue.",
      needMoreNames: "Ajoutez au moins deux noms pour lancer la roue.",
    },
    gameTools: {
      title: "Outils de jeu",
      intro: "Choisissez un jeu dans ce menu puis ouvrez-le.",
      selectLabel: "Choisir un jeu",
    },
    wave: {
      title: "Wave Length",
      intro: "Utilisez la cible cachee et l'indice pour lancer le debat. Revelez ensuite la cible.",
      promptLabel: "Prompt",
      guessLabel: "Estimation de l'equipe",
      lowLabel: "Bas",
      highLabel: "Haut",
      reveal: "Reveler la cible",
      hide: "Masquer la cible",
      newRound: "Nouveau round",
      target: "Cible : {value}",
      distance: "Ecart : {value}",
    },
    buzzer: {
      title: "Buzzer",
      intro: "Ajoutez des participants et demarrez un round. Le premier buzz est verrouille et mis en evidence.",
      playersTitle: "Participants",
      addLabel: "Ajouter un participant",
      addPlaceholder: "Entrez un nom",
      addButton: "Ajouter",
      empty: "Aucun participant pour le moment. Ajoutez-en au moins deux.",
      buzzNow: "Buzz",
      reset: "Reinitialiser le round",
      winner: "Premier buzz : {name}",
      waiting: "En attente du premier buzz",
      enterPlayer: "Entrez un nom avant d'ajouter.",
      duplicatePlayer: "Ce participant existe deja.",
    },
    labels: {
      yourName: "Votre pseudo",
      roomCode: "Code de session",
      shareLink: "Lien de partage",
      qrCode: "QR code",
      yourPick: "Votre choix",
      anonymous: "Anonyme",
    },
    placeholders: {
      name: "Pseudo affiché pour les votes",
      roomCode: "ABC123",
      supabaseUrl: "https://YOUR_PROJECT.supabase.co",
      supabaseKey: "Votre cle anon publique",
    },
    actions: {
      startPlanning: "Démarrer une session de planning",
      createRoom: "Créer une session",
      joinRoom: "Rejoindre",
      revealVotes: "Révéler les votes",
      resetVotes: "Réinitialiser les votes",
      leaveRoom: "Quitter la session",
      copyLink: "Copier le lien",
      saveReload: "Enregistrer et recharger",
      close: "Fermer",
    },
    status: {
      revealed: "Revele",
      hidden: "Cache",
      votesCount: "Votes {voted}/{total}",
      waiting: "En attente",
      voted: "Vote",
      noVote: "Pas de vote",
    },
    table: {
      title: "Table d'estimation",
      waitingEmpty: "En attente des participants",
      roomLabel: "Salle {id}",
      votesCount: "Votes {voted}/{total}",
      average: "Moyenne: {value}",
      strike: "Striiiiike",
    },
    card: {
      title: "Choisir une carte",
      help: "Votre choix reste caché jusqu'à la révélation.",
      none: "Aucune carte",
    },
    views: {
      table: "Autour de la table",
      list: "Vue liste",
    },
    privacy: {
      title: "Confidentialite",
      intro: "Cette page explique les informations minimales traitees pour les sessions.",
      dataTitle: "Donnees de session",
      dataBody:
        "Nous stockons votre pseudo, votre vote et le code de session dans Supabase pour faire fonctionner la session. Ces donnees sont visibles par toute personne ayant le lien.",
      localTitle: "Stockage local",
      localBody:
        "Nous stockons un identifiant aleatoire, votre pseudo et votre langue dans le stockage local du navigateur.",
      sharingTitle: "Partage",
      sharingBody: "Toute personne ayant le lien peut rejoindre et voir les donnees de session.",
      contactTitle: "Contact",
      contactBody: "Questions ? Ecrivez a straoss.inc@gmail.com.",
    },
    tooltips: {
      youRock: "Vous etes les meilleurs",
      disagree: "Pas d'accord",
      tired: "Fatigue",
    },
    session: {
      title: "Session {id}",
      shareHint: "Envoyez le lien ou partagez le QR code ci-dessous.",
      defaultName: "Session {id}",
    },
    setup: {
      title: "Configuration Supabase",
      description: "Entrez l'URL du projet et la cle anon. C'est enregistre dans votre navigateur.",
      url: "URL Supabase",
      anonKey: "Cle anon",
    },
    settings: {
      title: "Parametres",
      deckTitle: "Valeurs des cartes",
      deckHelp: "Entrez les valeurs separees par des virgules.",
      deckPlaceholder: "0, 0.5, 1, 2, 3, 5, 8, 13, 21, ?, Break",
      updateDeck: "Mettre a jour le paquet",
      resetDeck: "Reinitialiser par defaut",
      rangeTitle: "Generer une plage",
      rangeHelp: "Definissez min, max, et pas pour creer une suite.",
      min: "Min",
      max: "Max",
      step: "Pas",
      includeQuestion: "Inclure ?",
      includeBreak: "Inclure Pause",
      applyRange: "Appliquer la plage",
    },
    support: {
      title: "Soutenir",
      blurb: "Si Poker Planning vous a aide, vous pouvez soutenir son developpement.",
      button: "Soutenir Poker Planning",
      note: "Optionnel. L'app reste gratuite.",
    },
    notices: {
      enterName: "Veuillez entrer votre pseudo pour continuer.",
      supabaseNotConfigured: "Supabase n'est pas configure.",
      createFailed: "Impossible de creer la session.",
      joinFailed: "Impossible de rejoindre la session.",
      sessionClosed: "Session fermee, veuillez creer une nouvelle session",
      enterRoom: "Entrez un code de session pour rejoindre.",
      submitVoteFailed: "Impossible d'envoyer le vote.",
      revealFailed: "Impossible de reveler les votes.",
      resetFailed: "Impossible de reinitialiser les votes.",
      reactionFailed: "Impossible de mettre a jour la reaction.",
      invalidRange: "Entrez un min, max et pas valides.",
      emptyDeck: "Le paquet ne peut pas etre vide.",
      updateDeckFailed: "Impossible de mettre a jour le paquet.",
      linkCopied: "Lien copie.",
      copyFailed: "Impossible de copier le lien.",
    },
    notFound: {
      title: "Page introuvable",
      body: "Cette page n'existe pas encore. Retournez au tableau principal.",
      backHome: "Retour",
    },
    tip: "Astuce : demandez a tous de rejoindre avant de reveler les votes.",
    qr: {
      hint: "Scanner pour rejoindre cette session",
    },
    deck: ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "?", "Break"],
    cardLabels: { Break: "Pause" },
  },
};

const LANGUAGES = [
  { code: "en", flagClass: "flag-en" },
  { code: "fr", flagClass: "flag-fr" },
];

function getLanguagePack(language) {
  return translations[language] || translations.en;
}

function translate(language, key, vars = {}) {
  const lookup = (pack) =>
    key.split(".").reduce((value, segment) => (value && value[segment] !== undefined ? value[segment] : null), pack);
  const pack = getLanguagePack(language);
  let text = lookup(pack);
  if (text == null) {
    text = lookup(translations.en);
  }
  if (typeof text !== "string") return "";
  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] !== undefined ? vars[name] : ""));
}

function getDeck(language) {
  const pack = getLanguagePack(language);
  return Array.isArray(pack.deck) ? pack.deck : translations.en.deck;
}

function getCardLabel(value, language) {
  const pack = getLanguagePack(language);
  if (!value) return "";
  const labels = pack.cardLabels || {};
  return labels[value] || value;
}

function sanitizeWheelName(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 28);
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function createWheelSlicePath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

function createArcPath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const delta = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = delta > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function serializeDeck(deck) {
  return Array.isArray(deck) ? deck.join(", ") : "";
}

function parseDeckInput(value) {
  if (!value) return [];
  const normalized = value.replace(/[\n;]/g, ",");
  return normalized
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(items) {
  const seen = new Set();
  const result = [];
  items.forEach((item) => {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  });
  return result;
}

function countDecimals(value) {
  const str = String(value);
  const parts = str.split(".");
  return parts[1] ? parts[1].length : 0;
}

function buildRangeValues(minValue, maxValue, stepValue) {
  const min = Number(minValue);
  const max = Number(maxValue);
  const step = Number(stepValue);
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0) {
    return null;
  }
  const decimals = Math.max(countDecimals(minValue), countDecimals(maxValue), countDecimals(stepValue));
  const factor = Math.pow(10, decimals);
  let start = Math.round(min * factor);
  let end = Math.round(max * factor);
  let stepInt = Math.round(step * factor);
  if (stepInt === 0) return null;
  const direction = start <= end ? 1 : -1;
  stepInt = Math.abs(stepInt) * direction;
  const values = [];
  let guard = 0;
  for (let current = start; direction > 0 ? current <= end : current >= end; current += stepInt) {
    const raw = (current / factor).toFixed(decimals);
    const cleaned = raw.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
    values.push(cleaned);
    guard += 1;
    if (guard > 500) break;
  }
  return values;
}

function computeSeatPositions(count, width, height, seatSize, padding = 24) {
  if (!count || !width || !height) return [];
  const margin = seatSize / 2 + padding;
  const w = width + margin * 2;
  const h = height + margin * 2;
  const halfW = w / 2;
  const halfH = h / 2;
  const leftCount = Math.ceil(count / 2);
  const rightCount = Math.floor(count / 2);

  const positions = new Array(count);
  const getY = (index, total) => {
    if (total <= 1) return 0;
    const step = h / (total + 1);
    return -halfH + step * (index + 1);
  };

  for (let i = 0; i < count; i += 1) {
    const isLeft = i % 2 === 0;
    const sideIndex = Math.floor(i / 2);
    const total = isLeft ? leftCount : rightCount;
    const x = isLeft ? -halfW : halfW;
    const y = getY(sideIndex, total);
    positions[i] = { x, y };
  }

  return positions;
}

function formatAverage(value) {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  const str = rounded.toFixed(2);
  return str.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function getTileText(language, id) {
  const pack = getLanguagePack(language);
  const fallback = translations.en.tiles[id] || { title: "", description: "", cta: "" };
  const localized = pack.tiles && pack.tiles[id] ? pack.tiles[id] : {};
  return { ...fallback, ...localized };
}

function getWavePrompts(language) {
  return WAVE_PROMPTS[language] || WAVE_PROMPTS.en;
}

function randomWaveTarget() {
  return Math.floor(Math.random() * 101);
}

function pickWavePrompt(language) {
  const prompts = getWavePrompts(language);
  if (!prompts.length) return "";
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function getInitialLanguage() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && translations[stored]) return stored;
  const browser = (navigator.language || "").toLowerCase();
  if (browser.startsWith("fr")) return "fr";
  return "en";
}

function LanguageMenu({ language, setLanguage, t }) {
  return (
    <div className="language-menu" role="group" aria-label={t("languageLabel")}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`language-button${language === lang.code ? " active" : ""}`}
          onClick={() => setLanguage(lang.code)}
          aria-label={t(`languageNames.${lang.code}`)}
          title={t(`languageNames.${lang.code}`)}
        >
          <span className={`flag ${lang.flagClass}`} aria-hidden="true"></span>
        </button>
      ))}
    </div>
  );
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", handleChange);
    return () => window.removeEventListener("hashchange", handleChange);
  }, []);

  return hash;
}

function navigateTo(route) {
  window.location.hash = route;
}

function ArrowRight() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5m6-7l-7 7 7 7" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10.5l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm8.5 4.5-.9-.52.1-1.04-1.5-2.6-1.07.13-.72-.83-3-.6-.49.94-1.02.05-.53-.9-3 .6-.72.83-1.07-.13-1.5 2.6.1 1.04-.9.52.9.52-.1 1.04 1.5 2.6 1.07-.13.72.83 3 .6.53-.9 1.02.05.49.94 3-.6.72-.83 1.07.13 1.5-2.6-.1-1.04.9-.52z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="vote-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4 4 10-10" />
    </svg>
  );
}

function QrCode({ text, label }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    if (!text || !window.QRCode) return;
    // QRCode is loaded via CDN in index.html
    new window.QRCode(containerRef.current, {
      text,
      width: 160,
      height: 160,
      colorDark: "#1a1c1e",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M,
    });
  }, [text]);

  return <div className="qr-code" ref={containerRef} aria-label={label || "QR code"} />;
}

function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString || "");
  const room = params.get("room") || "";
  return { room };
}

function normalizeRoomCode(value) {
  return (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function getOrCreateUserId() {
  const existing = localStorage.getItem(STORAGE_KEYS.userId);
  if (existing) return existing;
  const next = `user_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(STORAGE_KEYS.userId, next);
  return next;
}

function Tile({ item, index, language }) {
  const className = item.active ? "tile reveal" : "tile disabled reveal";
  const text = getTileText(language, item.id);

  const handleActivate = () => {
    if (!item.active) return;
    navigateTo(`/${item.id}`);
  };

  const handleKeyDown = (event) => {
    if (!item.active) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      className={className}
      role="button"
      tabIndex={item.active ? 0 : -1}
      aria-disabled={!item.active}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="tile-icon" aria-hidden="true">
        {item.icon}
      </div>
      <div>
        <h3 className="tile-title">{text.title}</h3>
        <p className="tile-body">{text.description}</p>
      </div>
      <span className="tile-cta">
        {text.cta}
        <ArrowRight />
      </span>
    </div>
  );
}

function Home({ language, setLanguage, t }) {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-toolbar">
          <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
        </div>
        <div className="brand">
          <h1 className="brand-title">{t("home.title")}</h1>
        </div>
        <p className="lede">{t("home.lede")}</p>
      </header>

      <section className="tile-grid" aria-label={t("home.toolsLabel")}>
        {tiles.map((item, index) => (
          <Tile key={item.id} item={item} index={index} language={language} />
        ))}
      </section>

      <Footer />
    </div>
  );
}

function GameTools({ language, setLanguage, t }) {
  const [selectedGameTool, setSelectedGameTool] = useState(GAME_TOOL_IDS[0]);
  const selectedGameToolText = getTileText(language, selectedGameTool);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="page-header">
          <a className="back-link" href="#/">
            <HomeIcon />
            {t("menu.home")}
          </a>
          <h1 className="brand-title">{t("gameTools.title")}</h1>
          <div className="page-actions">
            <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
          </div>
        </div>
        <p className="lede">{t("gameTools.intro")}</p>
      </header>

      <section className="section reveal game-tools-section" style={{ animationDelay: "0.08s" }}>
        <div className="game-tools-row">
          <div className="game-tools-picker">
            <p className="game-tools-label">{t("gameTools.selectLabel")}</p>
            <div className="game-tools-tabs" role="group" aria-label={t("gameTools.selectLabel")}>
              {GAME_TOOL_IDS.map((toolId) => {
                const toolText = getTileText(language, toolId);
                const isActive = selectedGameTool === toolId;
                return (
                  <button
                    key={toolId}
                    type="button"
                    aria-pressed={isActive}
                    className={`game-tools-tab${isActive ? " active" : ""}`}
                    onClick={() => setSelectedGameTool(toolId)}
                  >
                    {toolText.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="muted game-tools-description">{selectedGameToolText.description}</p>
      </section>

      {selectedGameTool === "wheel-of-name" && (
        <WheelOfName language={language} setLanguage={setLanguage} t={t} embedded={true} />
      )}
      {selectedGameTool === "wave-length" && (
        <WaveLength language={language} setLanguage={setLanguage} t={t} embedded={true} />
      )}
      {selectedGameTool === "buzzer" && <Buzzer language={language} setLanguage={setLanguage} t={t} embedded={true} />}

      <Footer />
    </div>
  );
}

function WheelOfName({ language, setLanguage, t, embedded = false }) {
  const [names, setNames] = useState(() => [...DEFAULT_WHEEL_NAMES]);
  const [nameDraft, setNameDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const selectedIndexRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = setTimeout(() => setNotice(""), 2400);
    return () => clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, []);

  const slices = useMemo(() => {
    if (!names.length) return [];
    const angle = 360 / names.length;
    return names.map((name, index) => {
      const startAngle = index * angle;
      const endAngle = startAngle + angle;
      const midAngle = startAngle + angle / 2;
      const separator = polarToCartesian(180, 180, 172, startAngle);
      const labelPoint = polarToCartesian(180, 180, 108, midAngle);
      const shortName = name.length > 14 ? `${name.slice(0, 11)}...` : name;
      return {
        key: `${name}_${index}`,
        fill: WHEEL_COLORS[index % WHEEL_COLORS.length],
        path: createWheelSlicePath(180, 180, 172, startAngle, endAngle),
        separator,
        labelPoint,
        label: shortName,
      };
    });
  }, [names]);

  const handleAddName = () => {
    const nextName = sanitizeWheelName(nameDraft);
    if (!nextName) {
      setNotice(t("wheel.enterName"));
      return;
    }
    const exists = names.some((name) => name.toLowerCase() === nextName.toLowerCase());
    if (exists) {
      setNotice(t("wheel.duplicateName"));
      return;
    }
    setNames((current) => [...current, nextName]);
    setNameDraft("");
    setSelectedName("");
    setNotice("");
  };

  const handleInputKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleAddName();
  };

  const handleRemoveName = (index) => {
    if (spinning) return;
    setNames((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setSelectedName("");
  };

  const handleSpin = () => {
    if (spinning) return;
    if (names.length < 2) {
      setNotice(t("wheel.needMoreNames"));
      return;
    }
    const targetIndex = Math.floor(Math.random() * names.length);
    const angle = 360 / names.length;
    const centerAngle = targetIndex * angle + angle / 2;
    const normalizedCurrent = ((rotation % 360) + 360) % 360;
    const targetNormalized = (360 - centerAngle) % 360;
    const deltaToTarget = (targetNormalized - normalizedCurrent + 360) % 360;
    const extraTurns = 6 + Math.floor(Math.random() * 2);

    selectedIndexRef.current = targetIndex;
    setSpinning(true);
    setSelectedName("");
    setRotation((current) => current + extraTurns * 360 + deltaToTarget);
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
      const index = selectedIndexRef.current;
      spinTimeoutRef.current = null;
      if (index == null || !names[index]) return;
      setSelectedName(names[index]);
    }, 5900);
  };

  const toolSection = (
    <section className="section reveal wheel-section" style={{ animationDelay: "0.08s" }}>
      <div className="wheel-layout">
        <div className="wheel-stage" aria-live="polite">
          <div className="wheel-pointer" aria-hidden="true"></div>
          <svg
            className="wheel-svg"
            viewBox="0 0 360 360"
            role="img"
            aria-label={t("wheel.title")}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <circle cx="180" cy="180" r="176" className="wheel-ring" />
            {slices.map((slice) => (
              <g key={slice.key}>
                <path d={slice.path} fill={slice.fill} />
                <line
                  x1="180"
                  y1="180"
                  x2={slice.separator.x}
                  y2={slice.separator.y}
                  className="wheel-divider"
                />
                <text
                  x={slice.labelPoint.x}
                  y={slice.labelPoint.y}
                  className="wheel-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {slice.label}
                </text>
              </g>
            ))}
            <circle cx="180" cy="180" r="28" className="wheel-hub" />
            <circle cx="180" cy="180" r="6" className="wheel-core" />
          </svg>
        </div>

        <div className="wheel-controls">
          <h2>{t("wheel.namesTitle")}</h2>
          <label htmlFor={embedded ? "wheel-name-input-embedded" : "wheel-name-input"}>{t("wheel.addLabel")}</label>
          <div className="wheel-input-row">
            <input
              id={embedded ? "wheel-name-input-embedded" : "wheel-name-input"}
              className="input"
              placeholder={t("wheel.addPlaceholder")}
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={spinning}
            />
            <button className="button" type="button" onClick={handleAddName} disabled={spinning}>
              {t("wheel.addButton")}
            </button>
          </div>
          {notice && <div className="notice">{notice}</div>}
          <div className="wheel-name-list">
            {names.length === 0 && <p className="muted wheel-empty">{t("wheel.namesEmpty")}</p>}
            {names.map((name, index) => (
              <div key={`${name}_${index}`} className="wheel-name-item">
                <span className="wheel-name-value">{name}</span>
                <button
                  className="button ghost small wheel-remove-button"
                  type="button"
                  onClick={() => handleRemoveName(index)}
                  disabled={spinning}
                  aria-label={t("wheel.removeName", { name })}
                >
                  {t("wheel.remove")}
                </button>
              </div>
            ))}
          </div>
          <div className="inline-actions">
            <button className="button secondary wheel-spin-button" type="button" onClick={handleSpin} disabled={spinning}>
              {spinning ? t("wheel.spinning") : t("wheel.spin")}
            </button>
          </div>
          {selectedName && !spinning && (
            <div className="wheel-result" aria-live="polite">
              {t("wheel.winner", { name: selectedName })}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (embedded) {
    return toolSection;
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="page-header">
          <a className="back-link" href="#/">
            <HomeIcon />
            {t("menu.home")}
          </a>
          <h1 className="brand-title">{t("wheel.title")}</h1>
          <div className="page-actions">
            <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
          </div>
        </div>
        <p className="lede">{t("wheel.intro")}</p>
      </header>

      {toolSection}

      <Footer />
    </div>
  );
}

function WaveLength({ language, setLanguage, t, embedded = false }) {
  const [target, setTarget] = useState(() => randomWaveTarget());
  const [guess, setGuess] = useState(50);
  const [revealed, setRevealed] = useState(false);
  const [prompt, setPrompt] = useState(() => pickWavePrompt(language));
  const [gaugeDragging, setGaugeDragging] = useState(false);
  const gaugeRef = useRef(null);
  const distance = Math.abs(target - guess);
  const gaugeSize = { width: 360, height: 220, cx: 180, cy: 180 };
  const gaugeTrackRadius = 130;
  const gaugeNeedleRadius = 98;
  const gaugeStartAngle = 240;
  const gaugeSweep = 240;
  const gaugeEndAngle = (gaugeStartAngle + gaugeSweep) % 360;
  const guessAngle = gaugeStartAngle + (guess / 100) * gaugeSweep;
  const normalizedGuessAngle = ((guessAngle % 360) + 360) % 360;
  const gaugeTrackPath = createArcPath(gaugeSize.cx, gaugeSize.cy, gaugeTrackRadius, gaugeStartAngle, gaugeEndAngle);
  const gaugeProgressPath = createArcPath(gaugeSize.cx, gaugeSize.cy, gaugeTrackRadius, gaugeStartAngle, normalizedGuessAngle);
  const gaugeTicks = Array.from({ length: 11 }, (_, index) => {
    const ratio = index / 10;
    const angle = gaugeStartAngle + ratio * gaugeSweep;
    const outer = polarToCartesian(gaugeSize.cx, gaugeSize.cy, gaugeTrackRadius + 10, angle);
    const inner = polarToCartesian(gaugeSize.cx, gaugeSize.cy, index % 5 === 0 ? gaugeTrackRadius - 20 : gaugeTrackRadius - 14, angle);
    return {
      key: index,
      major: index % 5 === 0,
      outer,
      inner,
    };
  });

  useEffect(() => {
    setPrompt(pickWavePrompt(language));
  }, [language]);

  useEffect(() => {
    if (!revealed) return;
    setGaugeDragging(false);
  }, [revealed]);

  useEffect(() => {
    if (!gaugeDragging) return;
    const stopDragging = () => setGaugeDragging(false);
    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, [gaugeDragging]);

  const handleNewRound = () => {
    setTarget(randomWaveTarget());
    setGuess(50);
    setRevealed(false);
    setPrompt(pickWavePrompt(language));
  };

  const shortestAngleDistance = (a, b) => {
    const diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
  };

  const getGuessFromPointerEvent = (event) => {
    if (!gaugeRef.current) return null;
    const rect = gaugeRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const localX = ((event.clientX - rect.left) / rect.width) * gaugeSize.width;
    const localY = ((event.clientY - rect.top) / rect.height) * gaugeSize.height;
    const angle = (Math.atan2(localY - gaugeSize.cy, localX - gaugeSize.cx) * 180) / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;
    const clockwiseDistance = (normalizedAngle - gaugeStartAngle + 360) % 360;

    let ratio = clockwiseDistance / gaugeSweep;
    if (clockwiseDistance > gaugeSweep) {
      const distToStart = shortestAngleDistance(normalizedAngle, gaugeStartAngle);
      const distToEnd = shortestAngleDistance(normalizedAngle, gaugeEndAngle);
      ratio = distToStart <= distToEnd ? 0 : 1;
    }

    return Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  };

  const applyPointerGuess = (event) => {
    if (revealed) return;
    const nextGuess = getGuessFromPointerEvent(event);
    if (nextGuess == null) return;
    setGuess(nextGuess);
  };

  const handleGaugePointerDown = (event) => {
    if (revealed) return;
    event.preventDefault();
    setGaugeDragging(true);
    applyPointerGuess(event);
  };

  const handleGaugePointerMove = (event) => {
    if (!gaugeDragging || revealed) return;
    applyPointerGuess(event);
  };

  const adjustGuess = (delta) => {
    if (revealed) return;
    setGuess((current) => Math.max(0, Math.min(100, current + delta)));
  };

  const toolSection = (
    <section className="section reveal wave-section" style={{ animationDelay: "0.08s" }}>
      <p className="wave-prompt-label">{t("wave.promptLabel")}</p>
      <div className="wave-prompt">{prompt}</div>

      <div className="wave-guess-wrap">
        <div className="wave-guess-header">
          <span className="wave-guess-label">{t("wave.guessLabel")}</span>
          <span className="wave-guess-value">{guess}</span>
        </div>
        <div className="wave-gauge-shell">
          <svg
            ref={gaugeRef}
            className={`wave-gauge${revealed ? " readonly" : ""}`}
            viewBox={`0 0 ${gaugeSize.width} ${gaugeSize.height}`}
            role="img"
            aria-label={t("wave.guessLabel")}
            onPointerDown={handleGaugePointerDown}
            onPointerMove={handleGaugePointerMove}
            onPointerUp={() => setGaugeDragging(false)}
            onPointerCancel={() => setGaugeDragging(false)}
          >
            <path d={gaugeTrackPath} className="wave-gauge-track" />
            {guess > 0 && <path d={gaugeProgressPath} className="wave-gauge-progress" />}
            {gaugeTicks.map((tick) => (
              <line
                key={tick.key}
                x1={tick.outer.x}
                y1={tick.outer.y}
                x2={tick.inner.x}
                y2={tick.inner.y}
                className={`wave-gauge-tick${tick.major ? " major" : ""}`}
              />
            ))}
            <line
              x1={gaugeSize.cx}
              y1={gaugeSize.cy}
              x2={gaugeSize.cx}
              y2={gaugeSize.cy - gaugeNeedleRadius}
              className="wave-gauge-needle"
              transform={`rotate(${guessAngle} ${gaugeSize.cx} ${gaugeSize.cy})`}
            />
            <circle cx={gaugeSize.cx} cy={gaugeSize.cy} r="8" className="wave-gauge-hub" />
          </svg>
        </div>
        <div className="wave-range-labels">
          <span>{t("wave.lowLabel")}</span>
          <span>{t("wave.highLabel")}</span>
        </div>
        <div className="wave-adjust-row">
          <button className="button ghost small" type="button" onClick={() => adjustGuess(-5)} disabled={revealed || guess <= 0}>
            -5
          </button>
          <button className="button ghost small" type="button" onClick={() => adjustGuess(-1)} disabled={revealed || guess <= 0}>
            -1
          </button>
          <button className="button ghost small" type="button" onClick={() => adjustGuess(1)} disabled={revealed || guess >= 100}>
            +1
          </button>
          <button className="button ghost small" type="button" onClick={() => adjustGuess(5)} disabled={revealed || guess >= 100}>
            +5
          </button>
        </div>
      </div>

      <div className="inline-actions">
        <button className="button secondary" type="button" onClick={handleNewRound}>
          {t("wave.newRound")}
        </button>
        <button className="button" type="button" onClick={() => setRevealed((current) => !current)}>
          {revealed ? t("wave.hide") : t("wave.reveal")}
        </button>
      </div>

      {revealed && (
        <div className="wave-result" aria-live="polite">
          <p>{t("wave.target", { value: target })}</p>
          <p>{t("wave.distance", { value: distance })}</p>
        </div>
      )}
    </section>
  );

  if (embedded) {
    return toolSection;
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="page-header">
          <a className="back-link" href="#/">
            <HomeIcon />
            {t("menu.home")}
          </a>
          <h1 className="brand-title">{t("wave.title")}</h1>
          <div className="page-actions">
            <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
          </div>
        </div>
        <p className="lede">{t("wave.intro")}</p>
      </header>

      {toolSection}

      <Footer />
    </div>
  );
}

function Buzzer({ language, setLanguage, t, embedded = false }) {
  const [players, setPlayers] = useState(() => [...DEFAULT_BUZZER_PLAYERS]);
  const [playerDraft, setPlayerDraft] = useState("");
  const [winner, setWinner] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timeoutId = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timeoutId);
  }, [notice]);

  const handleAddPlayer = () => {
    const nextPlayer = sanitizeWheelName(playerDraft);
    if (!nextPlayer) {
      setNotice(t("buzzer.enterPlayer"));
      return;
    }
    const exists = players.some((player) => player.toLowerCase() === nextPlayer.toLowerCase());
    if (exists) {
      setNotice(t("buzzer.duplicatePlayer"));
      return;
    }
    setPlayers((current) => [...current, nextPlayer]);
    setPlayerDraft("");
  };

  const handleDraftKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleAddPlayer();
  };

  const handleRemovePlayer = (index) => {
    setPlayers((current) => {
      const removed = current[index];
      if (removed && removed === winner) {
        setWinner("");
      }
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleBuzz = (playerName) => {
    if (winner) return;
    setWinner(playerName);
  };

  const handleReset = () => {
    setWinner("");
  };

  const toolSection = (
    <section className="section reveal buzzer-section" style={{ animationDelay: "0.08s" }}>
      <div className="buzzer-top">
        <h2>{t("buzzer.playersTitle")}</h2>
        <button className="button secondary" type="button" onClick={handleReset}>
          {t("buzzer.reset")}
        </button>
      </div>

      <label htmlFor={embedded ? "buzzer-player-input-embedded" : "buzzer-player-input"}>{t("buzzer.addLabel")}</label>
      <div className="wheel-input-row">
        <input
          id={embedded ? "buzzer-player-input-embedded" : "buzzer-player-input"}
          className="input"
          value={playerDraft}
          placeholder={t("buzzer.addPlaceholder")}
          onChange={(event) => setPlayerDraft(event.target.value)}
          onKeyDown={handleDraftKeyDown}
        />
        <button className="button" type="button" onClick={handleAddPlayer}>
          {t("buzzer.addButton")}
        </button>
      </div>

      {notice && <div className="notice">{notice}</div>}

      <div className={`buzzer-winner${winner ? " active" : ""}`} aria-live="polite">
        {winner ? t("buzzer.winner", { name: winner }) : t("buzzer.waiting")}
      </div>

      <div className="buzzer-grid">
        {players.length === 0 && <p className="muted wheel-empty">{t("buzzer.empty")}</p>}
        {players.map((player, index) => {
          const isWinner = winner && player === winner;
          return (
            <div key={`${player}_${index}`} className={`buzzer-player${isWinner ? " winner" : ""}`}>
              <span className="buzzer-player-name">{player}</span>
              <div className="buzzer-player-actions">
                <button className="button" type="button" onClick={() => handleBuzz(player)} disabled={Boolean(winner)}>
                  {t("buzzer.buzzNow")}
                </button>
                <button
                  className="button ghost small"
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  aria-label={t("wheel.removeName", { name: player })}
                >
                  {t("wheel.remove")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  if (embedded) {
    return toolSection;
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="page-header">
          <a className="back-link" href="#/">
            <HomeIcon />
            {t("menu.home")}
          </a>
          <h1 className="brand-title">{t("buzzer.title")}</h1>
          <div className="page-actions">
            <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
          </div>
        </div>
        <p className="lede">{t("buzzer.intro")}</p>
      </header>

      {toolSection}

      <Footer />
    </div>
  );
}

function BackendSetup({ backendInstance, t }) {
  const [url, setUrl] = useState(backendInstance.settings.url || "");
  const [anonKey, setAnonKey] = useState(backendInstance.settings.anonKey || "");

  const handleSave = () => {
    backendInstance.saveSettings({ url: url.trim(), anonKey: anonKey.trim() });
    window.location.reload();
  };

  return (
    <section className="section reveal" style={{ animationDelay: "0.08s" }}>
      <h2>{t("setup.title")}</h2>
      <p>{t("setup.description")}</p>
      <div className="form-grid">
        <label htmlFor="supabase-url">{t("setup.url")}</label>
        <input
          id="supabase-url"
          className="input"
          placeholder={t("placeholders.supabaseUrl")}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <label htmlFor="supabase-key">{t("setup.anonKey")}</label>
        <input
          id="supabase-key"
          className="input"
          placeholder={t("placeholders.supabaseKey")}
          value={anonKey}
          onChange={(event) => setAnonKey(event.target.value)}
        />
      </div>
      <div className="inline-actions">
        <button className="button" type="button" onClick={handleSave}>
          {t("actions.saveReload")}
        </button>
      </div>
    </section>
  );
}

function PokerPlanning({ queryString, language, setLanguage, t }) {
  const query = useMemo(() => parseQueryString(queryString), [queryString]);
  const [userId] = useState(() => getOrCreateUserId());
  const [userName, setUserName] = useState(localStorage.getItem(STORAGE_KEYS.userName) || "");
  const [roomCode, setRoomCode] = useState(normalizeRoomCode(query.room));
  const [room, setRoom] = useState(null);
  const [votes, setVotes] = useState([]);
  const [notice, setNotice] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deckDraft, setDeckDraft] = useState("");
  const [rangeMin, setRangeMin] = useState("0");
  const [rangeMax, setRangeMax] = useState("21");
  const [rangeStep, setRangeStep] = useState("0.5");
  const [includeQuestion, setIncludeQuestion] = useState(true);
  const [includeBreak, setIncludeBreak] = useState(true);
  const [cardFly, setCardFly] = useState(null);
  const [seatFlyItems, setSeatFlyItems] = useState([]);
  const [strikeVisible, setStrikeVisible] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const isInviteLink = Boolean(query.room);
  const tableTopRef = useRef(null);
  const shareLinkRef = useRef(null);
  const mySeatRef = useRef(null);
  const seatRefs = useRef(new Map());
  const previousVoteIdsRef = useRef(new Set());
  const hasSeenVotesRef = useRef(false);
  const strikeTimeoutRef = useRef(null);
  const sessionNoticeTimeoutRef = useRef(null);
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!query.room || !backend.ready) return;

    const normalized = normalizeRoomCode(query.room);
    setRoomCode(normalized);
    if (!normalized) return;

    const checkRoom = async () => {
      try {
        await backend.getRoom(normalized);
      } catch (error) {
        if (isRoomClosedError(error)) {
          redirectSessionClosed();
        } else {
          setNotice(error.message || t("notices.joinFailed"));
        }
      }
    };
    checkRoom();
  }, [query.room, backend.ready]);

  useEffect(() => {
    setSessionOpen(false);
    setSettingsOpen(false);
    previousVoteIdsRef.current = new Set();
    hasSeenVotesRef.current = false;
  }, [room && room.id]);

  useEffect(() => {
    if (!settingsOpen) return;
    const currentDeck = room && Array.isArray(room.deck) ? room.deck : getDeck(language);
    setDeckDraft(serializeDeck(currentDeck));
  }, [settingsOpen, room && room.id, language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.userName, userName);
  }, [userName]);

  useEffect(() => {
    return () => {
      if (strikeTimeoutRef.current) {
        clearTimeout(strikeTimeoutRef.current);
        strikeTimeoutRef.current = null;
      }
      if (sessionNoticeTimeoutRef.current) {
        clearTimeout(sessionNoticeTimeoutRef.current);
        sessionNoticeTimeoutRef.current = null;
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!room) return;
    if (!hasSeenVotesRef.current) {
      previousVoteIdsRef.current = new Set(votes.map((vote) => vote.user_id));
      hasSeenVotesRef.current = true;
      return;
    }
    const prevIds = previousVoteIdsRef.current;
    const newVotes = votes.filter((vote) => !prevIds.has(vote.user_id));
    previousVoteIdsRef.current = new Set(votes.map((vote) => vote.user_id));
    if (!newVotes.length) return;
    requestAnimationFrame(() => {
      const fromX = 28;
      const fromY = 28;
      const animations = newVotes
        .map((vote) => {
          const node = seatRefs.current.get(vote.user_id);
          if (!node) return null;
          const rect = node.getBoundingClientRect();
          const toX = rect.left + rect.width / 2;
          const toY = rect.top + rect.height / 2;
          const name = (vote.user_name || t("labels.anonymous")).trim();
          const label = name ? name[0].toUpperCase() : "";
          return {
            id: `seat_${vote.user_id}_${Date.now()}`,
            label,
            fromX,
            fromY,
            dx: toX - fromX,
            dy: toY - fromY,
          };
        })
        .filter(Boolean);
      if (animations.length) {
        setSeatFlyItems((items) => [...items, ...animations]);
      }
    });
  }, [room, votes, t]);

  useEffect(() => {
    if (!sessionOpen) {
      setSessionNotice("");
    }
  }, [sessionOpen]);

  useEffect(() => {
    if (!room) return;
    let active = true;
    const poll = () => {
      if (!active) return;
      refreshRoom(room.id).catch(() => {});
    };
    const intervalId = setInterval(poll, 4000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        poll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      active = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [room && room.id]);

  useEffect(() => {
    if (viewMode !== "table") return;
    const element = tableTopRef.current;
    if (!element) return;
    const updateSize = () => {
      setTableSize({ width: element.offsetWidth, height: element.offsetHeight });
    };
    updateSize();
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(updateSize);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [room && room.id, viewMode]);

  const isRoomClosedError = (error) => {
    if (!error) return false;
    const message = String(error.message || error).toLowerCase();
    return message.includes("room not found") || message.includes("no rows found");
  };

  const redirectSessionClosed = () => {
    setRoom(null);
    setVotes([]);
    setSessionOpen(false);
    setSettingsOpen(false);
    setNotice(t("notices.sessionClosed"));
    setRoomCode("");
    navigateTo("/poker-planning");
  };

  const refreshRoom = async (roomId) => {
    try {
      const [roomData, voteData] = await Promise.all([backend.getRoom(roomId), backend.listVotes(roomId)]);
      setRoom(roomData);
      setVotes(voteData || []);
    } catch (error) {
      if (isRoomClosedError(error)) {
        redirectSessionClosed();
        return;
      }
      throw error;
    }
  };

  const subscribeToRoom = (roomId) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    unsubscribeRef.current = backend.subscribeRoom(roomId, () => {
      refreshRoom(roomId).catch(() => {});
    });
  };

  const ensureName = () => {
    if (!userName.trim()) {
      setNotice(t("notices.enterName"));
      return false;
    }
    return true;
  };

  const handleCreateRoom = async () => {
    if (isInviteLink) return;
    if (!backend.ready) {
      setNotice(t("notices.supabaseNotConfigured"));
      return;
    }
    if (!ensureName()) return;
    setBusy(true);
    setNotice("");

    let roomId = "";
    let created = false;
    let attempts = 0;

    while (!created && attempts < 3) {
      attempts += 1;
      roomId = generateRoomCode();
      try {
        await backend.createRoom({
          id: roomId,
          name: t("session.defaultName", { id: roomId }),
          deck: getDeck(language),
        });
        created = true;
      } catch (error) {
        if (attempts >= 3) {
          setNotice(error.message || t("notices.createFailed"));
        }
      }
    }

    if (!created) {
      setBusy(false);
      return;
    }

    try {
      await backend.joinRoom(roomId, { id: userId, name: userName.trim() });
      setRoomCode(roomId);
      await refreshRoom(roomId);
      subscribeToRoom(roomId);
    } catch (error) {
      setNotice(error.message || t("notices.joinFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!backend.ready) {
      setNotice(t("notices.supabaseNotConfigured"));
      return;
    }
    if (!ensureName()) return;
    const normalized = normalizeRoomCode(roomCode);
    if (!normalized) {
      setNotice(t("notices.enterRoom"));
      return;
    }

    setBusy(true);
    setNotice("");

    try {
      await backend.getRoom(normalized);
      await backend.joinRoom(normalized, { id: userId, name: userName.trim() });
      setRoomCode(normalized);
      await refreshRoom(normalized);
      subscribeToRoom(normalized);
    } catch (error) {
      if (isRoomClosedError(error)) {
        redirectSessionClosed();
      } else {
        setNotice(error.message || t("notices.joinFailed"));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.leaveRoom(room.id, userId);
    } finally {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setRoom(null);
      setVotes([]);
      setSessionOpen(false);
      setSettingsOpen(false);
      setBusy(false);
    }
  };

  const handleSelectCard = async (card) => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.setVote(room.id, { id: userId, name: userName.trim() }, card);
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.submitVoteFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleCardPick = async (card, event) => {
    if (!room) return;
    const seatEl = mySeatRef.current;
    if (seatEl && event && event.currentTarget) {
      const from = event.currentTarget.getBoundingClientRect();
      const to = seatEl.getBoundingClientRect();
      const fromX = from.left + from.width / 2;
      const fromY = from.top + from.height / 2;
      const toX = to.left + to.width / 2;
      const toY = to.top + to.height / 2;
      setCardFly({
        id: `${Date.now()}_${card}`,
        label: getCardLabel(card, language),
        fromX,
        fromY,
        dx: toX - fromX,
        dy: toY - fromY,
      });
    }
    await handleSelectCard(card);
  };

  const handleSeatFlyEnd = (id) => {
    setSeatFlyItems((items) => items.filter((item) => item.id !== id));
  };

  const handleReveal = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.updateRoom(room.id, { revealed: true });
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.revealFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.resetRoom(room.id);
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.resetFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateDeck = async () => {
    if (!room) return;
    const parsed = uniqueValues(parseDeckInput(deckDraft));
    if (parsed.length === 0) {
      setNotice(t("notices.emptyDeck"));
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await backend.updateRoom(room.id, { deck: parsed });
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.updateDeckFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleResetDeck = async () => {
    if (!room) return;
    const fallback = getDeck(language);
    setDeckDraft(serializeDeck(fallback));
    setBusy(true);
    setNotice("");
    try {
      await backend.updateRoom(room.id, { deck: fallback });
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.updateDeckFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleApplyRange = () => {
    const values = buildRangeValues(rangeMin, rangeMax, rangeStep);
    if (!values || values.length === 0) {
      setNotice(t("notices.invalidRange"));
      return;
    }
    const deckValues = [...values];
    if (includeQuestion) deckValues.push("?");
    if (includeBreak) deckValues.push("Break");
    setDeckDraft(serializeDeck(deckValues));
  };

  const pushSessionNotice = (message) => {
    if (sessionNoticeTimeoutRef.current) {
      clearTimeout(sessionNoticeTimeoutRef.current);
    }
    setSessionNotice(message);
    sessionNoticeTimeoutRef.current = setTimeout(() => {
      setSessionNotice("");
    }, 2400);
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else if (shareLinkRef.current) {
        shareLinkRef.current.focus();
        shareLinkRef.current.select();
        const successful = document.execCommand("copy");
        window.getSelection()?.removeAllRanges?.();
        shareLinkRef.current.blur();
        if (!successful) {
          throw new Error("copy");
        }
      } else {
        throw new Error("copy");
      }
      pushSessionNotice(t("notices.linkCopied"));
    } catch (error) {
      pushSessionNotice(t("notices.copyFailed"));
    }
  };

  const handleReaction = async (type) => {
    if (!room) return;
    const me = votes.find((vote) => vote.user_id === userId);
    if (!me) return;
    const nextReaction = me.reaction === type ? null : type;
    try {
      await backend.updateReaction(room.id, userId, nextReaction);
      await refreshRoom(room.id);
    } catch (error) {
      setNotice(error.message || t("notices.reactionFailed"));
    }
  };

  const handleYouRock = () => handleReaction("yourock");
  const handleDisagree = () => handleReaction("disagree");
  const handleTired = () => handleReaction("tired");

  const setSeatRef = (voteId) => (node) => {
    if (node) {
      seatRefs.current.set(voteId, node);
    } else {
      seatRefs.current.delete(voteId);
    }
    if (voteId === userId) {
      mySeatRef.current = node;
    }
  };

  const myVote = votes.find((vote) => vote.user_id === userId);
  const selected = myVote ? myVote.vote_value : null;
  const revealed = room ? room.revealed : false;
  const votedCount = votes.filter((vote) => vote.vote_value).length;
  const totalCount = votes.length;
  const submittedVotes = votes.filter((vote) => vote.vote_value);
  const numericVotes = submittedVotes
    .map((vote) => Number(vote.vote_value))
    .filter((value) => Number.isFinite(value));
  const averageValue =
    revealed && numericVotes.length
      ? formatAverage(numericVotes.reduce((sum, value) => sum + value, 0) / numericVotes.length)
      : "";
  const strike =
    revealed &&
    submittedVotes.length > 1 &&
    submittedVotes.every((vote) => vote.vote_value === submittedVotes[0].vote_value);

  useEffect(() => {
    if (!strike) {
      setStrikeVisible(false);
      if (strikeTimeoutRef.current) {
        clearTimeout(strikeTimeoutRef.current);
        strikeTimeoutRef.current = null;
      }
      return;
    }
    setStrikeVisible(true);
    if (strikeTimeoutRef.current) {
      clearTimeout(strikeTimeoutRef.current);
    }
    strikeTimeoutRef.current = setTimeout(() => {
      setStrikeVisible(false);
    }, 3200);
  }, [strike]);
  const deck = room && Array.isArray(room.deck) ? room.deck : getDeck(language);

  const shareBase =
    window.location.origin === "null"
      ? window.location.href.split("#")[0]
      : `${window.location.origin}${window.location.pathname}`;
  const shareLink = room ? `${shareBase}#/poker-planning?room=${room.id}` : "";
  const isTableView = viewMode === "table";
  const maxTableSeats = 12;
  const visibleVotes = isTableView ? votes.slice(0, maxTableSeats) : votes;
  const minSeatSlots = 8;
  const seatSlots = isTableView ? Math.max(visibleVotes.length, minSeatSlots) : 0;
  const seatCount = Math.max(seatSlots, 1);
  const denseLayout = isTableView && visibleVotes.length > 10;
  const seatPositions = useMemo(() => {
    if (!isTableView) return [];
    const count = seatSlots;
    if (!count || !tableSize.width || !tableSize.height) return [];
    const seatSize = denseLayout ? 48 : 60;
    const padding = denseLayout ? 52 : 70;
    return computeSeatPositions(count, tableSize.width, tableSize.height, seatSize, padding);
  }, [seatSlots, tableSize.width, tableSize.height, denseLayout, isTableView]);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="page-header">
          <a className="back-link" href="#/">
            <HomeIcon />
            {t("menu.home")}
          </a>
          <h1 className="brand-title">{t("poker.title")}</h1>
          <div className="page-actions">
            <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
            {room && (
              <button
                className="menu-button"
                type="button"
                onClick={() => {
                  setSettingsOpen(true);
                  setSessionOpen(false);
                }}
                aria-label={t("menu.openSettings")}
              >
                <GearIcon />
                {t("menu.settings")}
              </button>
            )}
            {room && (
              <button
                className="menu-button"
                type="button"
                onClick={() => {
                  setSessionOpen(true);
                  setSettingsOpen(false);
                }}
                aria-label={t("menu.openSession")}
              >
                <MenuIcon />
                {t("menu.session")}
              </button>
            )}
          </div>
        </div>
      </header>

      {!backend.ready && <BackendSetup backendInstance={backend} t={t} />}

      {notice && <div className="notice">{notice}</div>}
      {seatFlyItems.length > 0 && (
        <div className="seat-fly-layer" aria-hidden="true">
          {seatFlyItems.map((item) => (
            <div
              key={item.id}
              className="seat-fly"
              style={{
                "--from-x": `${item.fromX}px`,
                "--from-y": `${item.fromY}px`,
                "--dx": `${item.dx}px`,
                "--dy": `${item.dy}px`,
              }}
              onAnimationEnd={() => handleSeatFlyEnd(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      {cardFly && (
        <div className="card-fly-layer" aria-hidden="true">
          <div
            key={cardFly.id}
            className="card-fly"
            style={{
              "--from-x": `${cardFly.fromX}px`,
              "--from-y": `${cardFly.fromY}px`,
              "--dx": `${cardFly.dx}px`,
              "--dy": `${cardFly.dy}px`,
            }}
            onAnimationEnd={() => setCardFly(null)}
          >
            {cardFly.label}
          </div>
        </div>
      )}

      {backend.ready && !room && (
        <section className="section reveal" style={{ animationDelay: "0.12s" }}>
          <h2>{t("poker.startJoin")}</h2>
          <div className="form-grid">
            <label htmlFor="user-name">{t("labels.yourName")}</label>
            <input
              id="user-name"
              className="input"
              placeholder={t("placeholders.name")}
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
            <label htmlFor="room-code">{t("labels.roomCode")}</label>
            <input
              id="room-code"
              className="input"
              placeholder={t("placeholders.roomCode")}
              value={roomCode}
              onChange={(event) => setRoomCode(normalizeRoomCode(event.target.value))}
            />
          </div>
          <div className="inline-actions">
            {!isInviteLink && (
              <button className="button" type="button" onClick={handleCreateRoom} disabled={busy}>
                {t("actions.createRoom")}
              </button>
            )}
            <button className="button join" type="button" onClick={handleJoinRoom} disabled={busy}>
              {t("actions.joinRoom")}
            </button>
          </div>
          <p className="muted">{t("poker.shareTip")}</p>
        </section>
      )}

      {room && sessionOpen && (
        <div className="session-drawer" role="dialog" aria-modal="true">
          <div className="session-backdrop" onClick={() => setSessionOpen(false)}></div>
          <aside className="session-panel">
            <div className="session-panel-header">
              <div>
                <div className="session-panel-title">{t("session.title", { id: room.id })}</div>
                <div className="muted">{room.name}</div>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setSessionOpen(false)}
                aria-label={t("menu.closeSession")}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="divider"></div>
            <div className="share-grid">
              <div className="share-field">
                <div className="share-label-row">
                  <label htmlFor="share-link">{t("labels.shareLink")}</label>
                  <button className="button ghost small" type="button" onClick={handleCopyLink}>
                    {t("actions.copyLink")}
                  </button>
                </div>
                <input id="share-link" className="input" value={shareLink} readOnly ref={shareLinkRef} />
                <p className="muted">{t("session.shareHint")}</p>
                {sessionNotice && <div className="notice session-notice">{sessionNotice}</div>}
              </div>
              <div className="qr-panel">
                <div className="qr-label">{t("labels.qrCode")}</div>
                <QrCode text={shareLink} label={t("labels.qrCode")} />
                <div className="qr-hint">{t("qr.hint")}</div>
              </div>
            </div>
            <div className="session-actions">
              <button className="button danger" type="button" onClick={handleLeaveRoom} disabled={busy}>
                {t("actions.leaveRoom")}
              </button>
            </div>
          </aside>
        </div>
      )}

      {room && settingsOpen && (
        <div className="settings-drawer" role="dialog" aria-modal="true">
          <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}></div>
          <aside className="settings-panel">
            <div className="session-panel-header">
              <div>
                <div className="session-panel-title">{t("settings.title")}</div>
                <div className="muted">{room.name}</div>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label={t("menu.closeSettings")}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="settings-section">
              <h3>{t("settings.deckTitle")}</h3>
              <p className="muted">{t("settings.deckHelp")}</p>
              <textarea
                className="textarea"
                value={deckDraft}
                placeholder={t("settings.deckPlaceholder")}
                onChange={(event) => setDeckDraft(event.target.value)}
              />
              <div className="inline-actions">
                <button className="button secondary" type="button" onClick={handleUpdateDeck} disabled={busy}>
                  {t("settings.updateDeck")}
                </button>
                <button className="button ghost" type="button" onClick={handleResetDeck} disabled={busy}>
                  {t("settings.resetDeck")}
                </button>
              </div>
            </div>

            <div className="divider"></div>

            <div className="settings-section">
              <h3>{t("settings.rangeTitle")}</h3>
              <p className="muted">{t("settings.rangeHelp")}</p>
              <div className="form-grid">
                <label htmlFor="range-min">{t("settings.min")}</label>
                <input
                  id="range-min"
                  className="input"
                  value={rangeMin}
                  onChange={(event) => setRangeMin(event.target.value)}
                />
                <label htmlFor="range-max">{t("settings.max")}</label>
                <input
                  id="range-max"
                  className="input"
                  value={rangeMax}
                  onChange={(event) => setRangeMax(event.target.value)}
                />
                <label htmlFor="range-step">{t("settings.step")}</label>
                <input
                  id="range-step"
                  className="input"
                  value={rangeStep}
                  onChange={(event) => setRangeStep(event.target.value)}
                />
              </div>
              <div className="checkbox-row">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={includeQuestion}
                    onChange={(event) => setIncludeQuestion(event.target.checked)}
                  />
                  {t("settings.includeQuestion")}
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={includeBreak}
                    onChange={(event) => setIncludeBreak(event.target.checked)}
                  />
                  {t("settings.includeBreak")}
                </label>
              </div>
              <div className="inline-actions">
                <button className="button" type="button" onClick={handleApplyRange} disabled={busy}>
                  {t("settings.applyRange")}
                </button>
              </div>
            </div>

            <div className="divider"></div>

            <div className="settings-section support-section">
              <h3>{t("support.title")}</h3>
              <p className="muted">{t("support.blurb")}</p>
              <div className="inline-actions">
                <a className="button ghost support-button" href={SUPPORT_LINK} target="_blank" rel="noopener">
                  {t("support.button")}
                </a>
              </div>
              <p className="muted support-note">{t("support.note")}</p>
            </div>
          </aside>
        </div>
      )}

      {room && (
        <section className="section reveal" style={{ animationDelay: "0.2s" }}>
          <div className="table-header">
            <div className="view-toggle" role="group" aria-label="View">
              <button
                type="button"
                className={`view-button${viewMode === "table" ? " active" : ""}`}
                onClick={() => setViewMode("table")}
              >
                {t("views.table")}
              </button>
              <button
                type="button"
                className={`view-button${viewMode === "list" ? " active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                {t("views.list")}
              </button>
            </div>
            <div className="inline-actions">
              <button className="button secondary table-action" type="button" onClick={handleReveal} disabled={busy}>
                {t("actions.revealVotes")}
              </button>
              <button className="button ghost table-action" type="button" onClick={handleReset} disabled={busy}>
                {t("actions.resetVotes")}
              </button>
              <div className="reaction-stack">
                <button
                  className="reaction-button large"
                  type="button"
                  onClick={handleYouRock}
                  aria-label={t("tooltips.youRock")}
                  title={t("tooltips.youRock")}
                >
                  <img src="icons/icon-yourock.png" alt="" />
                </button>
                <button
                  className="reaction-button large"
                  type="button"
                  onClick={handleDisagree}
                  aria-label={t("tooltips.disagree")}
                  title={t("tooltips.disagree")}
                >
                  <img src="icons/icon-disagree.png" alt="" />
                </button>
                <button
                  className="reaction-button large"
                  type="button"
                  onClick={handleTired}
                  aria-label={t("tooltips.tired")}
                  title={t("tooltips.tired")}
                >
                  <img src="icons/icon-tired.png" alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="table-layout">
            <div className="card-panel">
              <h3>{t("card.title")}</h3>
              <p className="muted">{t("card.help")}</p>
              <div className="card-list">
                {deck.map((card) => (
                  <button
                    key={card}
                    type="button"
                    className={card === selected ? "card selected" : "card"}
                    onClick={(event) => handleCardPick(card, event)}
                    disabled={busy}
                  >
                    {getCardLabel(card, language)}
                  </button>
                ))}
              </div>
            </div>
            {isTableView ? (
              <div
                className={`table-stage${denseLayout ? " dense" : ""}`}
                style={{ "--seat-count": seatCount }}
              >
                <div className="table-top" ref={tableTopRef}>
                  <div className="table-label">{t("table.roomLabel", { id: room.id })}</div>
                  <div className="table-sub">{t("table.votesCount", { voted: votedCount, total: totalCount })}</div>
                  {averageValue && <div className="table-average">{t("table.average", { value: averageValue })}</div>}
                  {strike && strikeVisible && <div className="strike-badge">{t("table.strike")}</div>}
                </div>
                {visibleVotes.length === 0 && <div className="table-empty">{t("table.waitingEmpty")}</div>}
                {seatPositions.map((position, index) => {
                  const vote = visibleVotes[index];
                  const sideClass = position.x < 0 ? " seat-left" : position.x > 0 ? " seat-right" : "";
                  if (!vote) {
                    return (
                      <div
                        key={`empty_${index}`}
                        className={`seat empty${sideClass}`}
                        style={{ "--x": `${position.x}px`, "--y": `${position.y}px` }}
                      >
                        <div className="seat-chair" aria-hidden="true"></div>
                      </div>
                    );
                  }
                  const hasVote = Boolean(vote.vote_value);
                  const reaction = vote.reaction;
                  const reactionIcon = reaction ? reactionIcons[reaction] : null;
                  let bubbleContent = "";
                  if (revealed) {
                    bubbleContent = hasVote ? getCardLabel(vote.vote_value, language) : "-";
                  } else if (hasVote) {
                    bubbleContent = <CheckIcon />;
                  }
                  let statusText = t("status.waiting");
                  if (revealed && hasVote) {
                    statusText = t("status.voted");
                  } else if (revealed && !hasVote) {
                    statusText = t("status.noVote");
                  } else if (hasVote) {
                    statusText = t("status.voted");
                  }
                  return (
                    <div
                      key={`${vote.room_id}_${vote.user_id}`}
                      className={`seat${hasVote ? " voted" : ""}${revealed ? " revealed" : ""}${sideClass}`}
                      style={{ "--x": `${position.x}px`, "--y": `${position.y}px` }}
                    >
                      <div className="seat-bubble" ref={setSeatRef(vote.user_id)}>
                        {bubbleContent}
                        {reactionIcon && <img className="seat-reaction" src={reactionIcon} alt="" />}
                      </div>
                      <div className="seat-info">
                        <div className="seat-name">{vote.user_name || t("labels.anonymous")}</div>
                        <div className="seat-status">{statusText}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="seat-list">
                {votes.length === 0 && <div className="list-empty">{t("table.waitingEmpty")}</div>}
                {votes.map((vote) => {
                  const hasVote = Boolean(vote.vote_value);
                  const reaction = vote.reaction;
                  const reactionIcon = reaction ? reactionIcons[reaction] : null;
                  let bubbleContent = "";
                  if (revealed) {
                    bubbleContent = hasVote ? getCardLabel(vote.vote_value, language) : "-";
                  } else if (hasVote) {
                    bubbleContent = <CheckIcon />;
                  }
                  let statusText = t("status.waiting");
                  if (revealed && hasVote) {
                    statusText = t("status.voted");
                  } else if (revealed && !hasVote) {
                    statusText = t("status.noVote");
                  } else if (hasVote) {
                    statusText = t("status.voted");
                  }
                  return (
                    <div
                      key={`${vote.room_id}_${vote.user_id}`}
                      className={`seat-row${hasVote ? " voted" : ""}${revealed ? " revealed" : ""}`}
                    >
                      <div className="seat-bubble" ref={setSeatRef(vote.user_id)}>
                        {bubbleContent}
                        {reactionIcon && <img className="seat-reaction" src={reactionIcon} alt="" />}
                      </div>
                      <div className="seat-info">
                        <div className="seat-name">{vote.user_name || t("labels.anonymous")}</div>
                        <div className="seat-status">{statusText}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function NotFound({ language, setLanguage, t }) {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-toolbar">
          <LanguageMenu language={language} setLanguage={setLanguage} t={t} />
        </div>
        <h1 className="brand-title">{t("notFound.title")}</h1>
        <p className="lede">{t("notFound.body")}</p>
        <button className="button" type="button" onClick={() => navigateTo("/")}>
          {t("notFound.backHome")}
        </button>
      </header>
      <Footer />
    </div>
  );
}

function PrivacyModal({ t, onClose }) {
  return (
    <div className="privacy-modal" role="dialog" aria-modal="true">
      <div className="privacy-backdrop" onClick={onClose}></div>
      <div className="privacy-panel">
        <div className="privacy-header">
          <div>
            <h2>{t("privacy.title")}</h2>
            <p className="muted">{t("privacy.intro")}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t("actions.close")}>
            <CloseIcon />
          </button>
        </div>
        <div className="privacy-body">
          <h3>{t("privacy.dataTitle")}</h3>
          <p className="muted">{t("privacy.dataBody")}</p>
          <h3>{t("privacy.localTitle")}</h3>
          <p className="muted">{t("privacy.localBody")}</p>
          <h3>{t("privacy.sharingTitle")}</h3>
          <p className="muted">{t("privacy.sharingBody")}</p>
          <h3>{t("privacy.contactTitle")}</h3>
          <p className="muted">{t("privacy.contactBody")}</p>
        </div>
        <div className="privacy-actions">
          <button className="button" type="button" onClick={onClose}>
            {t("actions.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Copyright © 2026 STRAOSS inc. All rights reserved.</span>
      <div className="footer-links">
        <a className="footer-link" href="mailto:straoss.inc@gmail.com">
          Contact
        </a>
        <a className="footer-link" href="#/privacy">
          Privacy
        </a>
      </div>
    </footer>
  );
}

function App() {
  const hash = useHashRoute();
  const route = useMemo(() => hash.replace("#", ""), [hash]);
  const [path, queryString] = route.split("?");
  const [language, setLanguage] = useState(() => getInitialLanguage());
  const lastRouteRef = useRef({ path: "/", queryString: "" });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (path === "/privacy") return;
    const normalizedPath = path && path !== "" ? path : "/";
    lastRouteRef.current = { path: normalizedPath, queryString: queryString || "" };
  }, [path, queryString]);

  const t = (key, vars) => translate(language, key, vars);
  const showPrivacyModal = path === "/privacy";
  const activeRoute = showPrivacyModal ? lastRouteRef.current : { path: path || "/", queryString: queryString || "" };
  const pageTitle =
    showPrivacyModal
      ? t("privacy.title")
      : activeRoute.path === "/poker-planning"
      ? t("poker.title")
      : activeRoute.path === "/game-tools"
      ? t("gameTools.title")
      : activeRoute.path === "/wheel-of-name"
      ? t("wheel.title")
      : activeRoute.path === "/wave-length"
      ? t("wave.title")
      : activeRoute.path === "/buzzer"
      ? t("buzzer.title")
      : activeRoute.path === "/" || activeRoute.path === ""
        ? t("home.title")
        : t("notFound.title");

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const renderRoute = (routePath, routeQuery) => {
    if (routePath === "/" || routePath === "") {
      return <Home language={language} setLanguage={setLanguage} t={t} />;
    }
    if (routePath === "/poker-planning") {
      return <PokerPlanning queryString={routeQuery} language={language} setLanguage={setLanguage} t={t} />;
    }
    if (routePath === "/game-tools") {
      return <GameTools language={language} setLanguage={setLanguage} t={t} />;
    }
    if (routePath === "/wheel-of-name") {
      return <WheelOfName language={language} setLanguage={setLanguage} t={t} />;
    }
    if (routePath === "/wave-length") {
      return <WaveLength language={language} setLanguage={setLanguage} t={t} />;
    }
    if (routePath === "/buzzer") {
      return <Buzzer language={language} setLanguage={setLanguage} t={t} />;
    }
    return <NotFound language={language} setLanguage={setLanguage} t={t} />;
  };

  const closePrivacy = () => {
    const target = lastRouteRef.current || { path: "/", queryString: "" };
    const nextPath = target.path || "/";
    navigateTo(target.queryString ? `${nextPath}?${target.queryString}` : nextPath);
  };

  return (
    <>
      {renderRoute(activeRoute.path, activeRoute.queryString)}
      {showPrivacyModal && <PrivacyModal t={t} onClose={closePrivacy} />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
