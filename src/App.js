import React, { useEffect, useMemo, useRef, useState } from 'react';

const MODES = [
  { id: 'clock', label: 'Horloge' },
  { id: 'timer', label: 'Minuteur' },
  { id: 'stopwatch', label: 'Chrono' },
  { id: 'zones', label: 'Fuseaux' },
];

const TIMER_PRESETS = [
  { label: '5 min', seconds: 300 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '45 min', seconds: 2700 },
];

const ZONES = [
  { city: 'Paris', zone: 'Europe/Paris' },
  { city: 'Dakar', zone: 'Africa/Dakar' },
  { city: 'New York', zone: 'America/New_York' },
  { city: 'Tokyo', zone: 'Asia/Tokyo' },
];

const formatDuration = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const formatStopwatch = (elapsedMs) => {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const tenths = Math.floor((elapsedMs % 1000) / 100);
  return `${minutes}:${seconds}.${tenths}`;
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return now;
}

function ShellButton({ children, active, className = '', ...props }) {
  return (
    <button
      className={[
        'rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        active
          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]'
          : 'border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

function ModeTabs({ activeMode, onChange }) {
  return (
    <nav aria-label="Modes" className="flex flex-wrap gap-2">
      {MODES.map((mode) => (
        <ShellButton
          key={mode.id}
          type="button"
          active={activeMode === mode.id}
          onClick={() => onChange(mode.id)}
        >
          {mode.label}
        </ShellButton>
      ))}
    </nav>
  );
}

function ClockFace({ now, use24Hour, showSeconds, progress }) {
  const time = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: !use24Hour,
  }).format(now);

  const date = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
          Heure locale
        </p>
        <h1 className="tabular text-[clamp(3.2rem,12vw,8rem)] font-extrabold leading-none text-[var(--text)]">
          {time}
        </h1>
        <p className="mt-4 text-balance text-lg font-medium capitalize text-[var(--muted)]">
          {date}
        </p>
      </div>

      <div
        className="radial-progress mx-auto grid aspect-square w-36 place-items-center rounded-full border border-[var(--line)] lg:w-44"
        style={{ '--progress': `${progress}%` }}
        aria-hidden="true"
      >
        <div className="grid aspect-square w-[72%] place-items-center rounded-full border border-[var(--line)] bg-[var(--panel)]">
          <span className="tabular text-3xl font-bold text-[var(--accent)]">
            {now.getSeconds().toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}

function TimerPanel({ tracks }) {
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(900);
  const [remaining, setRemaining] = useState(900);
  const [isRunning, setIsRunning] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          audioRef.current?.pause();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const playRandomTrack = async () => {
    if (!audioRef.current || tracks.length === 0) return;

    audioRef.current.src = `/songs/${pickRandom(tracks)}`;
    audioRef.current.volume = 0.42;
    try {
      await audioRef.current.play();
      setAudioReady(true);
    } catch {
      setAudioReady(false);
    }
  };

  const start = async () => {
    if (remaining === 0) setRemaining(duration);
    setIsRunning(true);
    await playRandomTrack();
  };

  const pause = () => {
    setIsRunning(false);
    audioRef.current?.pause();
  };

  const reset = () => {
    setIsRunning(false);
    setRemaining(duration);
    audioRef.current?.pause();
  };

  const selectPreset = (seconds) => {
    setDuration(seconds);
    setRemaining(seconds);
    setIsRunning(false);
    audioRef.current?.pause();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => {
          if (isRunning) playRandomTrack();
        }}
      />

      <div
        className="radial-progress mx-auto grid aspect-square w-56 place-items-center rounded-full border border-[var(--line)] sm:w-64"
        style={{ '--progress': `${progress}%` }}
        aria-label={`Minuteur ${formatDuration(remaining)}`}
      >
        <div className="grid aspect-square w-[74%] place-items-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-center">
          <span className="tabular text-5xl font-extrabold text-[var(--text)]">
            {formatDuration(remaining)}
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Sommeil
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Minuteur musical
          </p>
          <p className="max-w-xl text-pretty text-[var(--muted)]">
            Lance le minuteur: une piste est choisie au hasard en arrière-plan.
            Aucun titre n’est affiché.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TIMER_PRESETS.map((preset) => (
            <ShellButton
              key={preset.seconds}
              type="button"
              active={duration === preset.seconds}
              onClick={() => selectPreset(preset.seconds)}
            >
              {preset.label}
            </ShellButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {isRunning ? (
            <ShellButton type="button" active onClick={pause}>
              Pause
            </ShellButton>
          ) : (
            <ShellButton type="button" active onClick={start}>
              Démarrer
            </ShellButton>
          )}
          <ShellButton type="button" onClick={reset}>
            Réinitialiser
          </ShellButton>
        </div>

        <p className="min-h-5 text-sm text-[var(--muted)]" aria-live="polite">
          {tracks.length === 0
            ? 'Ajoute des fichiers dans public/songs puis liste-les dans playlist.json.'
            : audioReady
              ? 'Lecture de fond active.'
              : 'La musique démarre après ton clic sur Démarrer.'}
        </p>
      </div>
    </section>
  );
}

function StopwatchPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (!isRunning || startedAt === null) return undefined;
    const interval = window.setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);
    return () => window.clearInterval(interval);
  }, [isRunning, startedAt]);

  const start = () => {
    setStartedAt(Date.now() - elapsed);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setStartedAt(null);
    setLaps([]);
  };

  return (
    <section className="grid gap-7">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
          Chronomètre
        </p>
        <h2 className="tabular text-[clamp(3.5rem,13vw,7.5rem)] font-extrabold leading-none text-[var(--text)]">
          {formatStopwatch(elapsed)}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {isRunning ? (
          <ShellButton type="button" active onClick={pause}>
            Pause
          </ShellButton>
        ) : (
          <ShellButton type="button" active onClick={start}>
            Démarrer
          </ShellButton>
        )}
        <ShellButton type="button" onClick={() => setLaps((items) => [elapsed, ...items].slice(0, 6))}>
          Tour
        </ShellButton>
        <ShellButton type="button" onClick={reset}>
          Réinitialiser
        </ShellButton>
      </div>

      {laps.length > 0 && (
        <ol className="grid gap-2 border-t border-[var(--line)] pt-4">
          {laps.map((lap, index) => (
            <li key={`${lap}-${index}`} className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Tour {laps.length - index}</span>
              <span className="tabular font-semibold text-[var(--accent)]">{formatStopwatch(lap)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ZonesPanel({ now }) {
  return (
    <section>
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
        Fuseaux
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ZONES.map((item) => (
          <article key={item.zone} className="rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-5">
            <h2 className="text-lg font-bold text-[var(--text)]">{item.city}</h2>
            <p className="tabular mt-3 text-3xl font-extrabold text-[var(--accent)]">
              {new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: item.zone,
              }).format(now)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]" translate="no">
              {item.zone}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const now = useNow();
  const [activeMode, setActiveMode] = useState('clock');
  const [theme, setTheme] = useState(() => localStorage.getItem('horloge:theme') || 'dark');
  const [use24Hour, setUse24Hour] = useState(() => localStorage.getItem('horloge:24h') !== 'false');
  const [showSeconds, setShowSeconds] = useState(() => localStorage.getItem('horloge:seconds') !== 'false');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    localStorage.setItem('horloge:theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('horloge:24h', String(use24Hour));
  }, [use24Hour]);

  useEffect(() => {
    localStorage.setItem('horloge:seconds', String(showSeconds));
  }, [showSeconds]);

  useEffect(() => {
    fetch('/songs/playlist.json')
      .then((response) => (response.ok ? response.json() : { tracks: [] }))
      .then((data) => setTracks(Array.isArray(data.tracks) ? data.tracks : []))
      .catch(() => setTracks([]));
  }, []);

  const secondProgress = useMemo(() => (now.getSeconds() / 60) * 100, [now]);

  return (
    <div className={`theme-${theme} min-h-screen bg-[var(--page)] px-4 py-6 text-[var(--text)] sm:px-6 lg:px-10`}>
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center gap-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Horloge</p>
            <h1 className="mt-2 text-balance text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
              Horloge simple
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <ShellButton type="button" active={theme === 'dark'} onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </ShellButton>
            <ShellButton type="button" active={use24Hour} onClick={() => setUse24Hour((value) => !value)}>
              {use24Hour ? '24 h' : '12 h'}
            </ShellButton>
            <ShellButton type="button" active={showSeconds} onClick={() => setShowSeconds((value) => !value)}>
              Secondes
            </ShellButton>
          </div>
        </header>

        <section className="app-panel rounded-2xl p-5 sm:p-8 lg:p-10">
          <ModeTabs activeMode={activeMode} onChange={setActiveMode} />

          <div className="mt-8">
            {activeMode === 'clock' && (
              <ClockFace
                now={now}
                use24Hour={use24Hour}
                showSeconds={showSeconds}
                progress={secondProgress}
              />
            )}
            {activeMode === 'timer' && <TimerPanel tracks={tracks} />}
            {activeMode === 'stopwatch' && <StopwatchPanel />}
            {activeMode === 'zones' && <ZonesPanel now={now} />}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
