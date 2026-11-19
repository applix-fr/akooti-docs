import type { Metadata } from 'next';
import Link from 'next/link';
import { SupportTiers } from '@/components/support-tiers';
import { repoUrl, sponsorUrl } from '@/lib/support';

export const metadata: Metadata = {
  title: 'Soutenir Akooti',
  description:
    'Soutenir le développement d’Akooti : un mainteneur, du code ouvert, aucun capital-risque. Dons ponctuels, mensuels ou sponsor d’entreprise via GitHub Sponsors.',
};

const nonFinancial = [
  {
    label: 'Signaler un bug',
    text: 'Un formulaire cassé, un importateur qui perd une entrée : c’est le retour le plus utile.',
    href: `${repoUrl}/issues`,
    cta: 'Ouvrir une issue',
  },
  {
    label: 'Traduire',
    text: 'L’interface et cette documentation existent en français et en anglais. Les autres langues manquent.',
    href: `${repoUrl}/blob/main/CONTRIBUTING.md`,
    cta: 'Lire CONTRIBUTING',
  },
  {
    label: 'Tester une distribution',
    text: 'Fedora, Arch, NixOS, Windows : chaque paquet validé élargit la couverture réelle.',
    href: `${repoUrl}/blob/main/CHANGELOG.md`,
    cta: 'Voir le journal des versions',
  },
];

export default function DonatePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line bg-app">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
          <Link
            href="/"
            className="font-mono text-[0.78rem] text-ink-faint transition-colors hover:text-ink"
          >
            ← Accueil
          </Link>

          <p className="mt-8 font-mono text-[11px] tracking-[0.06em] text-ink-faint uppercase">
            Soutenir le projet
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.03em] text-ink md:text-[3rem]">
            Un coffre qui reste à vous n’a pas besoin de capital-risque.
          </h1>
          <p className="mt-5 max-w-[64ch] text-[0.95rem] leading-[1.65] text-ink-muted">
            Akooti est maintenu par une personne, en dehors de toute levée de fonds. Les dons couvrent
            les certificats de signature Apple et Linux, les minutes de CI pour des builds
            reproductibles, et le temps passé sur les importateurs et le serveur MCP. Rien ne finance
            de la croissance.
          </p>

          <div className="mt-10">
            <SupportTiers />
          </div>

          <p className="mt-6 text-[0.8rem] leading-relaxed text-ink-faint">
            GitHub Sponsors encaisse les dons ponctuels comme les abonnements mensuels, et émet la
            facture pour les entreprises. Aucun don ne débloque de fonctionnalité : le coffre reste
            entièrement sous MIT.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-elevated">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
          <p className="font-mono text-[11px] tracking-[0.06em] text-ink-faint uppercase">
            Sans argent
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-[1.6rem] leading-[1.15] font-medium tracking-[-0.03em] text-ink md:text-[2rem]">
            Trois contributions qui valent un abonnement.
          </h2>

          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {nonFinancial.map((item) => (
              <li
                key={item.label}
                className="flex flex-col rounded-[4px] border border-line bg-panel p-5"
              >
                <h3 className="font-display text-[1.05rem] font-medium text-ink">{item.label}</h3>
                <p className="mt-2 flex-1 text-[0.84rem] leading-relaxed text-ink-muted">
                  {item.text}
                </p>
                <a
                  href={item.href}
                  className="mt-4 font-mono text-[0.78rem] text-signal underline-offset-4 hover:underline"
                >
                  {item.cta} →
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint uppercase">
            Dons directs :{' '}
            <a href={sponsorUrl} className="text-ink-muted transition-colors hover:text-ink">
              github.com/sponsors/STIFLEUR390
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
