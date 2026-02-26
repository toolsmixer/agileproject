const { useEffect, useMemo, useRef, useState } = React;

const backend = window.createBackend();

const tiles = [
  {
    id: "poker-planning",
    title: "Poker planning",
    description: "Run quick estimation rounds with Fibonacci-based cards.",
    cta: "Open tool",
    active: true,
    icon: "PP",
  },
  {
    id: "retro",
    title: "Retro board",
    description: "Collect highlights, lowlights, and ideas in one space.",
    cta: "Coming soon",
    active: false,
    icon: "RB",
  },
  {
    id: "standup",
    title: "Standup focus",
    description: "Keep daily updates clear and timeboxed.",
    cta: "Coming soon",
    active: false,
    icon: "SF",
  },
];

const pokerCards = ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "Break"];

const STORAGE_KEYS = {
  userId: "scrum_user_id",
  userName: "scrum_user_name",
};

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

function Tile({ item, index }) {
  const className = item.active ? "tile reveal" : "tile disabled reveal";

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
        <h3 className="tile-title">{item.title}</h3>
        <p className="tile-body">{item.description}</p>
      </div>
      <span className="tile-cta">{item.cta} -&gt;</span>
    </div>
  );
}

function Home() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <h1 className="brand-title">Agile Scrum Master Toolkit</h1>
          <span className="brand-tag">Control Room</span>
        </div>
        <p className="lede">
          A lightweight set of focused tools for Scrum Masters. Launch an app, keep the
          ceremony moving, and stay aligned.
        </p>
        <button
          className="button"
          type="button"
          onClick={() => navigateTo("/poker-planning")}
        >
          Start a planning session
        </button>
      </header>

      <section className="tile-grid" aria-label="Agile tools">
        {tiles.map((item, index) => (
          <Tile key={item.id} item={item} index={index} />
        ))}
      </section>

      <footer className="footer">Built for GitHub Pages. Add new tiles as your toolkit grows.</footer>
    </div>
  );
}

function BackendSetup({ backendInstance }) {
  const [url, setUrl] = useState(backendInstance.settings.url || "");
  const [anonKey, setAnonKey] = useState(backendInstance.settings.anonKey || "");

  const handleSave = () => {
    backendInstance.saveSettings({ url: url.trim(), anonKey: anonKey.trim() });
    window.location.reload();
  };

  return (
    <section className="section reveal" style={{ animationDelay: "0.08s" }}>
      <h2>Supabase setup</h2>
      <p>Enter your project URL and anon key. This is saved only in your browser.</p>
      <div className="form-grid">
        <label htmlFor="supabase-url">Supabase URL</label>
        <input
          id="supabase-url"
          className="input"
          placeholder="https://YOUR_PROJECT.supabase.co"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <label htmlFor="supabase-key">Anon key</label>
        <input
          id="supabase-key"
          className="input"
          placeholder="Your anon public key"
          value={anonKey}
          onChange={(event) => setAnonKey(event.target.value)}
        />
      </div>
      <div className="inline-actions">
        <button className="button" type="button" onClick={handleSave}>
          Save and reload
        </button>
      </div>
    </section>
  );
}

function PokerPlanning({ queryString }) {
  const query = useMemo(() => parseQueryString(queryString), [queryString]);
  const [userId] = useState(() => getOrCreateUserId());
  const [userName, setUserName] = useState(localStorage.getItem(STORAGE_KEYS.userName) || "");
  const [roomCode, setRoomCode] = useState(normalizeRoomCode(query.room));
  const [room, setRoom] = useState(null);
  const [votes, setVotes] = useState([]);
  const [storyDraft, setStoryDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (query.room) {
      setRoomCode(normalizeRoomCode(query.room));
    }
  }, [query.room]);

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

  const refreshRoom = async (roomId) => {
    const [roomData, voteData] = await Promise.all([backend.getRoom(roomId), backend.listVotes(roomId)]);
    setRoom(roomData);
    setVotes(voteData || []);
    setStoryDraft(roomData.story || "");
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
      setNotice("Please enter your name to continue.");
      return false;
    }
    return true;
  };

  const handleCreateRoom = async () => {
    if (!backend.ready) {
      setNotice("Supabase is not configured yet.");
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
          name: `Session ${roomId}`,
          deck: pokerCards,
        });
        created = true;
      } catch (error) {
        if (attempts >= 3) {
          setNotice(error.message || "Unable to create room.");
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
      setNotice(error.message || "Unable to join room.");
    } finally {
      setBusy(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!backend.ready) {
      setNotice("Supabase is not configured yet.");
      return;
    }
    if (!ensureName()) return;
    const normalized = normalizeRoomCode(roomCode);
    if (!normalized) {
      setNotice("Enter a room code to join.");
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
      setNotice(error.message || "Unable to join room.");
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
      setStoryDraft("");
      setBusy(false);
    }
  };

  const handleSelectCard = async (card) => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.setVote(room.id, { id: userId, name: userName.trim() }, card);
    } catch (error) {
      setNotice(error.message || "Unable to submit vote.");
    } finally {
      setBusy(false);
    }
  };

  const handleReveal = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.updateRoom(room.id, { revealed: true });
    } catch (error) {
      setNotice(error.message || "Unable to reveal votes.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.resetRoom(room.id);
    } catch (error) {
      setNotice(error.message || "Unable to reset votes.");
    } finally {
      setBusy(false);
    }
  };

  const handleStoryUpdate = async () => {
    if (!room) return;
    setBusy(true);
    try {
      await backend.updateRoom(room.id, { story: storyDraft });
    } catch (error) {
      setNotice(error.message || "Unable to update story.");
    } finally {
      setBusy(false);
    }
  };

  const myVote = votes.find((vote) => vote.user_id === userId);
  const selected = myVote ? myVote.vote_value : null;
  const revealed = room ? room.revealed : false;
  const votedCount = votes.filter((vote) => vote.vote_value).length;
  const totalCount = votes.length;
  const deck = room && Array.isArray(room.deck) ? room.deck : pokerCards;

  const shareBase =
    window.location.origin === "null"
      ? window.location.href.split("#")[0]
      : `${window.location.origin}${window.location.pathname}`;
  const shareLink = room ? `${shareBase}#/poker-planning?room=${room.id}` : "";

  return (
    <div className="app-shell">
      <header className="header">
        <a className="back-link" href="#/">&lt;- Back to toolkit</a>
        <div className="brand">
          <h1 className="brand-title">Poker planning</h1>
          <span className="brand-tag">Estimate Together</span>
        </div>
        <p className="lede">
          Create a room, share the code, and reveal votes together. Works on GitHub Pages with
          Supabase as the backend.
        </p>
      </header>

      {!backend.ready && <BackendSetup backendInstance={backend} />}

      {notice && <div className="notice">{notice}</div>}

      {backend.ready && !room && (
        <section className="section reveal" style={{ animationDelay: "0.12s" }}>
          <h2>Start or join a session</h2>
          <div className="form-grid">
            <label htmlFor="user-name">Your name</label>
            <input
              id="user-name"
              className="input"
              placeholder="Name used for votes"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
            <label htmlFor="room-code">Room code</label>
            <input
              id="room-code"
              className="input"
              placeholder="ABC123"
              value={roomCode}
              onChange={(event) => setRoomCode(normalizeRoomCode(event.target.value))}
            />
          </div>
          <div className="inline-actions">
            <button className="button" type="button" onClick={handleCreateRoom} disabled={busy}>
              Create new room
            </button>
            <button className="button secondary" type="button" onClick={handleJoinRoom} disabled={busy}>
              Join room
            </button>
          </div>
          <p className="muted">Share the room code with your team once you create it.</p>
        </section>
      )}

      {room && (
        <section className="section reveal" style={{ animationDelay: "0.14s" }}>
          <div className="session-header">
            <div>
              <h2>Session {room.id}</h2>
              <p className="muted">{room.name}</p>
            </div>
            <div className="status-pill">
              {revealed ? "Revealed" : "Hidden"} | Votes {votedCount}/{totalCount}
            </div>
          </div>
          <div className="divider"></div>
          <div className="form-grid">
            <label htmlFor="share-link">Share link</label>
            <input id="share-link" className="input" value={shareLink} readOnly />
            <label htmlFor="story">Story or topic</label>
            <textarea
              id="story"
              className="textarea"
              placeholder="Paste the story or discussion topic"
              value={storyDraft}
              onChange={(event) => setStoryDraft(event.target.value)}
            />
          </div>
          <div className="inline-actions">
            <button className="button" type="button" onClick={handleStoryUpdate} disabled={busy}>
              Update story
            </button>
            <button className="button secondary" type="button" onClick={handleReveal} disabled={busy}>
              Reveal votes
            </button>
            <button className="button ghost" type="button" onClick={handleReset} disabled={busy}>
              Reset votes
            </button>
            <button className="button ghost" type="button" onClick={handleLeaveRoom} disabled={busy}>
              Leave room
            </button>
          </div>
        </section>
      )}

      {room && (
        <section className="section reveal" style={{ animationDelay: "0.2s" }}>
          <h2>Team votes</h2>
          <div className="members-grid">
            {votes.length === 0 && <div className="member-card muted">No one has joined yet.</div>}
            {votes.map((vote) => {
              const hasVote = Boolean(vote.vote_value);
              let display = "Waiting";
              if (revealed && hasVote) {
                display = vote.vote_value;
              } else if (revealed && !hasVote) {
                display = "-";
              } else if (hasVote) {
                display = "Voted";
              }
              return (
                <div key={`${vote.room_id}_${vote.user_id}`} className="member-card">
                  <div className="member-name">{vote.user_name || "Anonymous"}</div>
                  <div className="member-value">{display}</div>
                  {!revealed && <div className="muted">{hasVote ? "Locked" : "Not yet"}</div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {room && (
        <section className="section reveal" style={{ animationDelay: "0.26s" }}>
          <h2>Pick a card</h2>
          <p>Your selection stays hidden until the reveal.</p>
          <div className="card-list">
            {deck.map((card) => (
              <button
                key={card}
                type="button"
                className={card === selected ? "card selected" : "card"}
                onClick={() => handleSelectCard(card)}
                disabled={busy}
              >
                {card}
              </button>
            ))}
          </div>
          <p>
            <strong>Your pick:</strong> {selected || "No card yet"}
          </p>
        </section>
      )}

      <footer className="footer">Tip: ask everyone to join before revealing votes.</footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="app-shell">
      <header className="header">
        <h1 className="brand-title">Page not found</h1>
        <p className="lede">That route does not exist yet. Head back to the toolkit.</p>
        <button className="button" type="button" onClick={() => navigateTo("/")}>Back home</button>
      </header>
    </div>
  );
}

function App() {
  const hash = useHashRoute();
  const route = useMemo(() => hash.replace("#", ""), [hash]);
  const [path, queryString] = route.split("?");

  if (path === "/" || path === "") {
    return <Home />;
  }

  if (path === "/poker-planning") {
    return <PokerPlanning queryString={queryString} />;
  }

  return <NotFound />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
