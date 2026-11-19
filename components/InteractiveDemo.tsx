'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Lock, Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Démo scriptée : aucune requête réseau, aucun secret réel.
 * Les phases montent de 0 (vide) à 6 (connecté) ; chaque transition a une cause
 * (une commande tapée, un appel d'outil MCP) et le résultat reste affiché.
 */
const PHASES = { idle: 0, searching: 1, found: 2, calling: 3, payload: 4, filled: 5, done: 6 } as const;

const DEMO = {
  item: 'prod-portainer',
  itemId: '9c1f4a7e',
  origin: 'http://localhost:9000',
  username: 'dev-admin',
};

const AUTO_SCRIPT: [number, number][] = [
  [250, PHASES.searching],
  [1100, PHASES.found],
  [1600, PHASES.calling],
  [2500, PHASES.payload],
  [3300, PHASES.filled],
  [4200, PHASES.done],
];

const MANUAL_SCRIPT: [number, number][] = [[250, PHASES.searching], [950, PHASES.found]];

const FILL_SCRIPT: [number, number][] = [
  [0, PHASES.calling],
  [850, PHASES.payload],
  [1650, PHASES.filled],
  [2550, PHASES.done],
];

/** Code TOTP de démonstration : déterministe, change toutes les 30 s comme le vrai. */
function useTotp() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const seconds = Math.floor(now / 1000);
  const step = Math.floor(seconds / 30);
  const code = useMemo(() => String((step * 2654435761) % 1_000_000).padStart(6, '0'), [step]);

  return { code, remaining: 30 - (seconds % 30), progress: (seconds % 30) / 30 };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function useScript(steps: [number, number][] | null, deps: unknown[]) {
  const [phase, setPhase] = useState<number>(PHASES.idle);

  // biome-ignore lint/correctness/useExhaustiveDependencies: le tableau de dépendances est fourni par l'appelant
  useEffect(() => {
    if (!steps) return;
    setPhase(steps[0]?.[1] ?? PHASES.idle);
    const ids = steps.map(([delay, next]) => setTimeout(() => setPhase(next), delay));
    return () => ids.forEach(clearTimeout);
  }, deps);

  return [phase, setPhase] as const;
}

export function InteractiveDemo() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [runId, setRunId] = useState(0);
  const [fillId, setFillId] = useState(0);
  const reduced = useReducedMotion();
  const totp = useTotp();
  const [typedUsername, setTypedUsername] = useState('');

  const [phase, setPhase] = useScript(
    reduced && mode === 'auto' ? null : mode === 'auto' ? AUTO_SCRIPT : MANUAL_SCRIPT,
    [mode, runId, reduced],
  );

  // Remplissage manuel : rejoue la seconde moitié de la séquence.
  useEffect(() => {
    if (fillId === 0) return;
    setPhase(PHASES.calling);
    const ids = FILL_SCRIPT.map(([delay, next]) =>
      setTimeout(() => setPhase(next), reduced ? 0 : delay),
    );
    return () => ids.forEach(clearTimeout);
  }, [fillId, reduced, setPhase]);

  useEffect(() => {
    if (!reduced) return;
    if (mode === 'auto') setPhase(PHASES.done);
  }, [mode, reduced, setPhase]);

  const replay = useCallback(() => {
    setMode('auto');
    setTypedUsername('');
    setRunId((value) => value + 1);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === 'auto' ? 'manual' : 'auto';
      if (next === 'auto') setRunId((value) => value + 1);
      return next;
    });
    setPhase(PHASES.idle);
  }, [setPhase]);

  const show = (target: number) => phase >= target;
  const filled = show(PHASES.filled);

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-panel shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <div className="grid grid-cols-1 divide-y divide-line lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* Terminal de l'agent */}
        <section aria-label="Terminal de l’agent" className="flex min-h-[26rem] flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
              </span>
              <span className="font-mono text-[11px] text-ink-faint">claude-code · akooti mcp</span>
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
              <span
                className={cn(
                  'size-1.5 rounded-full transition-colors duration-300',
                  phase >= PHASES.calling ? 'bg-ok' : 'bg-line-strong',
                )}
                aria-hidden
              />
              daemon
            </span>
          </header>

          <div
            className="flex flex-1 flex-col gap-3 p-4 font-mono text-[12.5px] leading-relaxed text-ink-muted"
            role="log"
            aria-live="polite"
          >
            <p className="text-ink-faint">
              <span className="text-signal">$</span> akooti mcp --token ak_mcp_••••
            </p>

            {show(PHASES.searching) && (
              <p className="animate-in text-ink">
                <span className="text-signal">&gt;</span> vault_search(&quot;portainer&quot;)
              </p>
            )}

            {show(PHASES.found) && (
              <p className="border-l border-line pl-3 text-ink-muted">
                1 correspondance · <span className="text-ink">{DEMO.item}</span> · Dev Local · 1,2 ms
              </p>
            )}

            {show(PHASES.calling) && (
              <p className="animate-in text-ink">
                <span className="text-signal">&gt;</span> vault_cdp_autofill({'{'}
                <br />
                <span className="pl-4 text-ink-muted">itemId: &quot;{DEMO.itemId}…&quot;,</span>
                <br />
                <span className="pl-4 text-ink-muted">origin: &quot;{DEMO.origin}&quot;</span>
                <br />
                {'}'})
              </p>
            )}

            {show(PHASES.payload) && (
              <pre className="animate-in overflow-x-auto rounded-[6px] border border-line bg-well p-3 text-[11.5px] leading-relaxed text-ink-muted">
                <code>
                  {'{\n'}
                  {'  "status": "filled",\n'}
                  {'  "fieldsFilled": ["username", "password", "totp"],\n'}
                  {'  "password": '}
                  <span className="text-signal-strong">&quot;[REDACTED — ZERO-LEAK]&quot;</span>
                  {',\n'}
                  {'  "totp": '}
                  <span className="text-signal-strong">&quot;[REDACTED — ZERO-LEAK]&quot;</span>
                  {'\n}'}
                </code>
              </pre>
            )}

            {show(PHASES.done) && (
              <p className="flex items-center gap-2 text-ok">
                <Check className="size-3.5" aria-hidden /> 3 champs remplis · rien de secret n’est
                passé par le modèle
              </p>
            )}

            {!show(PHASES.done) && (
              <span className="mt-auto flex items-center gap-1 text-ink-faint" aria-hidden>
                <span className="h-4 w-[7px] animate-pulse bg-ink-faint/70" />
              </span>
            )}
          </div>
        </section>

        {/* Navigateur cible */}
        <section aria-label="Formulaire de connexion cible" className="flex min-h-[26rem] flex-col">
          <header className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Lock className="size-3 text-ink-faint" aria-hidden />
            <span className="flex-1 truncate rounded-[6px] border border-line bg-well px-2 py-1 font-mono text-[11px] text-ink-muted">
              {DEMO.origin}/#!/auth
            </span>
          </header>

          {/* Bandeau TOTP : satellite attaché au chrome du navigateur, jamais superposé au formulaire */}
          <div className="flex items-center gap-3 border-b border-line bg-elevated px-4 py-2">
            <span className="shrink-0 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap text-ink-faint uppercase">
              <span className="hidden sm:inline">Akooti · </span>TOTP
            </span>
            <span
              className={cn(
                'shrink-0 font-mono text-[0.86rem] leading-none font-semibold tracking-[0.14em] whitespace-nowrap transition-colors duration-300',
                filled ? 'text-signal-strong' : 'text-ink-faint/60',
              )}
            >
              {filled ? `${totp.code.slice(0, 3)} ${totp.code.slice(3)}` : '••• •••'}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div
                className="hidden h-0.5 w-14 overflow-hidden rounded-full bg-line sm:block"
                aria-hidden
              >
                <div
                  className="h-full bg-signal transition-[width] duration-500 ease-linear"
                  style={{ width: filled ? `${100 - totp.progress * 100}%` : '0%' }}
                />
              </div>
              <span className="w-14 shrink-0 text-right font-mono text-[0.66rem] whitespace-nowrap text-ink-faint tabular-nums">
                {filled ? `${totp.remaining} s` : 'verrouillé'}
              </span>
            </div>
          </div>

          <div className="flex flex-1 items-start justify-center bg-app p-5">
            <form
              className="w-full max-w-[19rem] rounded-[10px] border border-line bg-panel p-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                Portainer CE · localhost:9000
              </p>
              <h3 className="mt-1.5 text-[1.05rem] font-semibold text-ink">Connexion administrateur</h3>

              <div className="mt-4 flex flex-col gap-3">
                <DemoInput
                  label="Utilisateur"
                  value={filled ? DEMO.username : typedUsername}
                  onValueChange={mode === 'manual' && !filled ? setTypedUsername : undefined}
                />
                <DemoInput label="Mot de passe" value={filled ? '••••••••••••••••' : ''} masked />
                <DemoInput
                  label="Code à usage unique"
                  value={filled ? `${totp.code.slice(0, 3)} ${totp.code.slice(3)}` : ''}
                  mono
                />
              </div>

              <button
                type="submit"
                disabled
                className={cn(
                  'mt-4 flex w-full items-center justify-center gap-2 rounded-[6px] px-3 py-2 text-[0.82rem] font-medium transition-colors duration-300',
                  show(PHASES.done)
                    ? 'bg-ok/15 text-ok'
                    : 'bg-signal text-app',
                )}
              >
                {show(PHASES.done) ? (
                  <>
                    <Check className="size-3.5" aria-hidden /> Connecté
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-elevated px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Simulation locale · aucune requête réseau
        </p>
        <div className="flex items-center gap-2">
          {mode === 'auto' && (
            <button
              type="button"
              onClick={replay}
              className="flex items-center gap-1.5 rounded-[6px] border border-line px-2.5 py-1.5 text-[0.76rem] text-ink transition-colors hover:bg-hover"
            >
              <RefreshCw className="size-3" aria-hidden /> Rejouer la démo
            </button>
          )}
          <button
            type="button"
            onClick={toggleMode}
            className="flex items-center gap-1.5 rounded-[6px] bg-hover px-2.5 py-1.5 text-[0.76rem] text-ink transition-colors hover:bg-line"
          >
            <Play className="size-3" aria-hidden />
            {mode === 'auto' ? 'Tester manuellement' : 'Revenir à la démo'}
          </button>
          {mode === 'manual' && (
            <button
              type="button"
              onClick={() => setFillId((value) => value + 1)}
              className="rounded-[6px] bg-signal px-2.5 py-1.5 text-[0.76rem] font-medium text-app transition-colors hover:bg-signal-strong"
            >
              Remplir avec Akooti
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoInput({
  label,
  value,
  masked = false,
  mono = false,
  onValueChange,
}: {
  label: string;
  value: string;
  masked?: boolean;
  mono?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const id = `demo-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[0.76rem] font-medium text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        readOnly={!onValueChange}
        onChange={(event) => onValueChange?.(event.target.value)}
        placeholder={onValueChange ? 'Saisir un identifiant' : undefined}
        className={cn(
          'h-8 rounded-[6px] border border-line bg-well px-2 text-[0.8rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-signal/30',
          masked && 'tracking-[0.1em] text-ink-muted',
          mono && 'font-mono tracking-[0.12em]',
        )}
      />
    </div>
  );
}
