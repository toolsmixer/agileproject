const { useEffect, useMemo, useRef, useState } = React;

const backend = window.createBackend();

const tiles = [
  { id: "poker-planning", active: true, icon: "PP" },
  { id: "retro", active: false, icon: "RB" },
  { id: "standup", active: false, icon: "SF" },
];

const STORAGE_KEYS = {
  userId: "scrum_user_id",
  userName: "scrum_user_name",
};

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
        title: "Poker planning",
        description: "Run quick estimation rounds with Fibonacci-based cards.",
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
      title: "Poker planning",
      startJoin: "Start or join a session",
      shareTip: "Share the room code with your team once you create it.",
    },
    labels: {
      yourName: "Your name",
      roomCode: "Room code",
      shareLink: "Share link",
      qrCode: "QR code",
      yourPick: "Your pick",
      anonymous: "Anonymous",
    },
    placeholders: {
      name: "Name used for votes",
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
      saveReload: "Save and reload",
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
    },
    card: {
      title: "Pick a card",
      help: "Your selection stays hidden until the reveal.",
      none: "No card yet",
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
    notices: {
      enterName: "Please enter your name to continue.",
      supabaseNotConfigured: "Supabase is not configured yet.",
      createFailed: "Unable to create room.",
      joinFailed: "Unable to join room.",
      enterRoom: "Enter a room code to join.",
      submitVoteFailed: "Unable to submit vote.",
      revealFailed: "Unable to reveal votes.",
      resetFailed: "Unable to reset votes.",
      invalidRange: "Enter a valid min, max, and step.",
      emptyDeck: "Deck cannot be empty.",
      updateDeckFailed: "Unable to update deck.",
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
    labels: {
      yourName: "Votre nom",
      roomCode: "Code de session",
      shareLink: "Lien de partage",
      qrCode: "QR code",
      yourPick: "Votre choix",
      anonymous: "Anonyme",
    },
    placeholders: {
      name: "Nom affiche pour les votes",
      roomCode: "ABC123",
      supabaseUrl: "https://YOUR_PROJECT.supabase.co",
      supabaseKey: "Votre cle anon publique",
    },
    actions: {
      startPlanning: "Demarrer une session de planning",
      createRoom: "Creer une session",
      joinRoom: "Rejoindre",
      revealVotes: "Reveler les votes",
      resetVotes: "Reinitialiser les votes",
      leaveRoom: "Quitter la session",
      saveReload: "Enregistrer et recharger",
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
    },
    card: {
      title: "Choisir une carte",
      help: "Votre choix reste cache jusqu'a la revelation.",
      none: "Aucune carte",
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
    notices: {
      enterName: "Veuillez entrer votre nom pour continuer.",
      supabaseNotConfigured: "Supabase n'est pas configure.",
      createFailed: "Impossible de creer la session.",
      joinFailed: "Impossible de rejoindre la session.",
      enterRoom: "Entrez un code de session pour rejoindre.",
      submitVoteFailed: "Impossible d'envoyer le vote.",
      revealFailed: "Impossible de reveler les votes.",
      resetFailed: "Impossible de reinitialiser les votes.",
      invalidRange: "Entrez un min, max et pas valides.",
      emptyDeck: "Le paquet ne peut pas etre vide.",
      updateDeckFailed: "Impossible de mettre a jour le paquet.",
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

function getTileText(language, id) {
  const pack = getLanguagePack(language);
  const fallback = translations.en.tiles[id] || { title: "", description: "", cta: "" };
  const localized = pack.tiles && pack.tiles[id] ? pack.tiles[id] : {};
  return { ...fallback, ...localized };
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
        >
          <span className={`flag ${lang.flagClass}`} aria-hidden="true"></span>
          {t(`languageNames.${lang.code}`)}
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
          <span className="brand-tag">{t("home.tag")}</span>
        </div>
        <p className="lede">{t("home.lede")}</p>
        <button
          className="button"
          type="button"
          onClick={() => navigateTo("/poker-planning")}
        >
          {t("home.start")}
        </button>
      </header>

      <section className="tile-grid" aria-label={t("home.toolsLabel")}>
        {tiles.map((item, index) => (
          <Tile key={item.id} item={item} index={index} language={language} />
        ))}
      </section>

      <footer className="footer">{t("home.footer")}</footer>
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
  const [busy, setBusy] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deckDraft, setDeckDraft] = useState("");
  const [rangeMin, setRangeMin] = useState("0");
  const [rangeMax, setRangeMax] = useState("21");
  const [rangeStep, setRangeStep] = useState("0.5");
  const [includeQuestion, setIncludeQuestion] = useState(true);
  const [includeBreak, setIncludeBreak] = useState(true);
  const tableTopRef = useRef(null);
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (query.room) {
      setRoomCode(normalizeRoomCode(query.room));
    }
  }, [query.room]);

  useEffect(() => {
    setSessionOpen(false);
    setSettingsOpen(false);
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
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

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
  }, [room && room.id]);

  const refreshRoom = async (roomId) => {
    const [roomData, voteData] = await Promise.all([backend.getRoom(roomId), backend.listVotes(roomId)]);
    setRoom(roomData);
    setVotes(voteData || []);
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
      setNotice(error.message || t("notices.joinFailed"));
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

  const myVote = votes.find((vote) => vote.user_id === userId);
  const selected = myVote ? myVote.vote_value : null;
  const revealed = room ? room.revealed : false;
  const votedCount = votes.filter((vote) => vote.vote_value).length;
  const totalCount = votes.length;
  const deck = room && Array.isArray(room.deck) ? room.deck : getDeck(language);

  const shareBase =
    window.location.origin === "null"
      ? window.location.href.split("#")[0]
      : `${window.location.origin}${window.location.pathname}`;
  const shareLink = room ? `${shareBase}#/poker-planning?room=${room.id}` : "";
  const seatCount = Math.max(votes.length, 1);
  const denseLayout = votes.length > 12;
  const seatPositions = useMemo(() => {
    const count = votes.length;
    if (!count || !tableSize.width || !tableSize.height) return [];
    const seatSize = denseLayout ? 48 : 60;
    return computeSeatPositions(count, tableSize.width, tableSize.height, seatSize, 28);
  }, [votes.length, tableSize.width, tableSize.height, denseLayout]);

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
            <button className="button" type="button" onClick={handleCreateRoom} disabled={busy}>
              {t("actions.createRoom")}
            </button>
            <button className="button secondary" type="button" onClick={handleJoinRoom} disabled={busy}>
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
                <label htmlFor="share-link">{t("labels.shareLink")}</label>
                <input id="share-link" className="input" value={shareLink} readOnly />
                <p className="muted">{t("session.shareHint")}</p>
              </div>
              <div className="qr-panel">
                <div className="qr-label">{t("labels.qrCode")}</div>
                <QrCode text={shareLink} label={t("labels.qrCode")} />
                <div className="qr-hint">{t("qr.hint")}</div>
              </div>
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
          </aside>
        </div>
      )}

      {room && (
        <section className="section reveal" style={{ animationDelay: "0.2s" }}>
          <div className="table-header">
            <h2>{t("table.title")}</h2>
            <div className="inline-actions">
              <div className="status-pill">
                {revealed ? t("status.revealed") : t("status.hidden")} |{" "}
                {t("status.votesCount", { voted: votedCount, total: totalCount })}
              </div>
              <button className="button secondary" type="button" onClick={handleReveal} disabled={busy}>
                {t("actions.revealVotes")}
              </button>
              <button className="button ghost" type="button" onClick={handleReset} disabled={busy}>
                {t("actions.resetVotes")}
              </button>
              <button className="button ghost" type="button" onClick={handleLeaveRoom} disabled={busy}>
                {t("actions.leaveRoom")}
              </button>
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
                    onClick={() => handleSelectCard(card)}
                    disabled={busy}
                  >
                    {getCardLabel(card, language)}
                  </button>
                ))}
              </div>
              <p>
                <strong>{t("labels.yourPick")}:</strong>{" "}
                {selected ? getCardLabel(selected, language) : t("card.none")}
              </p>
            </div>
            <div
              className={`table-stage${denseLayout ? " dense" : ""}`}
              style={{ "--seat-count": seatCount }}
            >
              <div className="table-top" ref={tableTopRef}>
                <div className="table-label">{t("table.roomLabel", { id: room.id })}</div>
                <div className="table-sub">{t("table.votesCount", { voted: votedCount, total: totalCount })}</div>
              </div>
              {votes.length === 0 && <div className="table-empty">{t("table.waitingEmpty")}</div>}
              {votes.map((vote, index) => {
                const hasVote = Boolean(vote.vote_value);
                const position = seatPositions[index] || { x: 0, y: 0 };
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
                    className={`seat${hasVote ? " voted" : ""}${revealed ? " revealed" : ""}`}
                    style={{ "--x": `${position.x}px`, "--y": `${position.y}px` }}
                  >
                    <div className="seat-bubble">{bubbleContent}</div>
                    <div className="seat-name">{vote.user_name || t("labels.anonymous")}</div>
                    <div className="seat-status">{statusText}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">{t("tip")}</footer>
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
    </div>
  );
}

function App() {
  const hash = useHashRoute();
  const route = useMemo(() => hash.replace("#", ""), [hash]);
  const [path, queryString] = route.split("?");
  const [language, setLanguage] = useState(() => getInitialLanguage());

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, vars) => translate(language, key, vars);
  const pageTitle =
    path === "/poker-planning"
      ? t("poker.title")
      : path === "/" || path === ""
        ? t("home.title")
        : t("notFound.title");

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  if (path === "/" || path === "") {
    return <Home language={language} setLanguage={setLanguage} t={t} />;
  }

  if (path === "/poker-planning") {
    return <PokerPlanning queryString={queryString} language={language} setLanguage={setLanguage} t={t} />;
  }

  return <NotFound language={language} setLanguage={setLanguage} t={t} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
