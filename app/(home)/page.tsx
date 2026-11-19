import Link from 'next/link';
import { Cloud, FileDown, HardDrive, Layers, Plug, Route } from 'lucide-react';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { SupportTiers } from '@/components/support-tiers';
import { repoUrl } from '@/lib/support';

const releasesUrl = `${repoUrl}/releases`;

const features = [
  {
    icon: Layers,
    tag: 'multi-dossiers',
    title: 'Un secret, plusieurs dossiers',
    body: 'Personnel, Dev Local et Agents & MCP sont fournis. Chaque entrée peut appartenir à plusieurs dossiers à la fois, sans duplication de secret.',
  },
  {
    icon: Route,
    tag: 'routage auto',
    title: 'Dev Local, sans configuration',
    body: '.local, .test, .localhost, 127.0.0.1 : les identifiants de développement atterrissent dans Dev Local, y compris sur un coffre déjà rempli.',
  },
  {
    icon: Plug,
    tag: 'mcp + cdp',
    title: 'Agents cloisonnés',
    body: 'Six outils MCP, des jetons par dossier avec portées et durée de vie. L’agent remplit un formulaire sans jamais recevoir la valeur.',
  },
  {
    icon: Cloud,
    tag: 'sync e2ee',
    title: 'Supabase chiffré de bout en bout',
    body: 'Enveloppes Argon2id et enregistrements chiffrés côté client. La base ne voit que du ciphertext, le conflit se règle au dernier écrivain.',
  },
  {
    icon: HardDrive,
    tag: 'sauvegardes',
    title: 'S3, MinIO, Drive ou NAS',
    body: 'Instantanés horodatés vers le stockage que vous possédez déjà, rétention réglable, restauration depuis l’écran de déverrouillage.',
  },
  {
    icon: FileDown,
    tag: 'import',
    title: 'Vos coffres existants',
    body: 'Buttercup, Bitwarden, Proton Pass, KeePassXC (.kdbx), 1Password : aperçu, détection des doublons, effacement sécurisé du fichier source.',
  },
];

const mcpConfig = `{
  "mcpServers": {
    "akooti": {
      "command": "akooti",
      "args": ["mcp", "--token", "ak_mcp_…"]
    }
  }
}`;

const eyebrow = 'font-mono text-[11px] font-medium tracking-[0.06em] text-ink-faint uppercase';
const headline = 'font-display text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] text-ink md:text-[2.25rem]';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 1 — Hero */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 50% 22%, color-mix(in oklab, var(--ak-signal) 14%, transparent) 0%, transparent 68%)',
          }}
        />
        <div className="mx-auto w-full max-w-[1280px] px-6 pt-20 pb-16 text-center md:px-12 md:pt-28 md:pb-24">
          <p className="inline-flex items-center gap-2 rounded-[4px] border border-line bg-panel px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-ink-muted uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            <span className="hidden sm:inline">Local-first · Zero-knowledge · </span>
            Zero-leak
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl font-display text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.04em] text-ink sm:text-[3.25rem] lg:text-[4.25rem]">
            Vos agents se connectent.
            <br />
            Ils ne lisent jamais
            <br />
            <span className="text-signal">vos secrets.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[62ch] text-[1rem] leading-[1.65] text-ink-muted">
            Akooti est un seul binaire Rust — coffre local, pont navigateur et serveur MCP — pour que
            Claude Code, Codex ou Cursor remplissent un formulaire de connexion ou lancent une
            commande authentifiée sans qu’un secret n’atteigne jamais le modèle.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={releasesUrl}
              className="rounded-[4px] bg-signal px-4 py-2.5 font-mono text-[0.8rem] font-medium text-app transition-colors hover:bg-signal-strong"
            >
              Installer Akooti
            </a>
            <Link
              href="/docs"
              className="rounded-[4px] border border-line bg-panel px-4 py-2.5 font-mono text-[0.8rem] font-medium text-ink transition-colors hover:border-line-strong hover:bg-hover"
            >
              Lire la documentation
            </Link>
            <Link
              href="/donate"
              className="px-4 py-2.5 font-mono text-[0.8rem] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Soutenir le projet
            </Link>
          </div>

          <p className="mt-8 font-mono text-[11px] tracking-[0.06em] text-ink-faint uppercase">
            v1.0.0 · Linux &amp; macOS · MIT
            <span className="hidden sm:inline"> · Windows en préparation</span>
          </p>
        </div>
      </section>

      {/* 2 — Démo */}
      <section className="border-b border-line bg-app">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
          <div className="flex flex-col gap-3 pb-7">
            <p className={eyebrow}>Le trajet d’un secret</p>
            <h2 className={`${headline} max-w-3xl`}>
              L’agent demande. Le coffre remplit. Le modèle ne voit rien.
            </h2>
          </div>
          <InteractiveDemo />
          <p className="mt-4 max-w-2xl text-[0.82rem] leading-relaxed text-ink-faint">
            Deux appels suffisent : <code className="font-mono text-ink-muted">vault_search</code>{' '}
            renvoie des métadonnées,{' '}
            <code className="font-mono text-ink-muted">vault_cdp_autofill</code> écrit directement
            dans le DOM via le protocole DevTools. Le payload de retour ne contient qu’un statut et le
            nom des champs remplis.
          </p>
        </div>
      </section>

      {/* 3 — Fonctionnalités */}
      <section className="border-b border-line bg-app">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
          <div className="flex flex-col gap-3 pb-8">
            <p className={eyebrow}>Ce que le coffre fait</p>
            <h2 className={`${headline} max-w-3xl`}>Six garanties, un seul binaire.</h2>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, tag, title, body }) => (
              <li key={tag} className="rounded-[4px] border border-line bg-panel p-5">
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5 text-signal" aria-hidden />
                  <span className="font-mono text-[10.5px] tracking-[0.06em] text-ink-faint uppercase">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[1.05rem] font-medium text-ink">{title}</h3>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-muted">{body}</p>
              </li>
            ))}

            {/* Carte large : la configuration MCP, en clair */}
            <li className="rounded-[4px] border border-line bg-panel p-5 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <Plug className="size-3.5 text-signal" aria-hidden />
                    <span className="font-mono text-[10.5px] tracking-[0.06em] text-ink-faint uppercase">
                      brancher un agent
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[1.05rem] font-medium text-ink">
                    Quatre lignes de JSON, un jeton cloisonné.
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-muted">
                    Le serveur MCP parle au démon local sur un socket Unix avec un jeton limité à un
                    dossier, des actions autorisées et une durée de vie.
                  </p>
                  <Link
                    href="/docs/mcp-and-ai-agents"
                    className="mt-3 inline-block font-mono text-[0.78rem] text-signal underline-offset-4 hover:underline"
                  >
                    Créer un jeton →
                  </Link>
                </div>
                <pre className="overflow-x-auto rounded-[4px] border border-line bg-well p-4 font-mono text-[0.76rem] leading-relaxed text-ink-muted md:w-[26rem]">
                  <code>{mcpConfig}</code>
                </pre>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 4 — Soutien */}
      <section className="border-b border-line bg-elevated">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
          <div className="flex flex-col gap-3 pb-8">
            <p className={eyebrow}>Soutenir le projet</p>
            <h2 className={`${headline} max-w-3xl`}>
              Un coffre qui reste à vous n’a pas besoin de capital-risque.
            </h2>
            <p className="mt-1 max-w-[64ch] text-[0.92rem] leading-relaxed text-ink-muted">
              Un mainteneur, du code ouvert, aucune levée de fonds. Les dons paient les certificats de
              signature Apple et Linux, les minutes de CI pour des builds reproductibles, et le temps
              de maintenance des importateurs et du serveur MCP.
            </p>
          </div>

          <SupportTiers />

          <p className="mt-8 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint uppercase">
            <a href={repoUrl} className="transition-colors hover:text-ink">
              Star sur GitHub
            </a>{' '}
            ·{' '}
            <a href={`${repoUrl}/issues`} className="transition-colors hover:text-ink">
              Signaler un bug
            </a>{' '}
            ·{' '}
            <Link href="/docs" className="transition-colors hover:text-ink">
              Améliorer la documentation
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
