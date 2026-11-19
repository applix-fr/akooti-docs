import Link from 'next/link';
import { gitConfig } from '@/lib/shared';

const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

const links = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'MCP & agents', href: '/docs/mcp-and-ai-agents' },
  { label: 'GitHub', href: repoUrl },
  { label: 'Licence MIT', href: `${repoUrl}/blob/main/LICENSE` },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-app">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-12">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/" className="font-mono text-[0.9rem] font-medium text-ink">
            akooti
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[0.78rem] text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[0.78rem] text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
        </div>
        <p className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
          Aucune analyse · aucun cookie · aucun pistage
        </p>
      </div>
    </footer>
  );
}
