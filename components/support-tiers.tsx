import { sponsorUrl, supportTiers } from '@/lib/support';

export function SupportTiers() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {supportTiers.map((tier) => (
        <li
          key={tier.id}
          className={
            tier.highlight
              ? 'flex flex-col rounded-[4px] border border-signal/60 bg-panel p-6'
              : 'flex flex-col rounded-[4px] border border-line bg-panel p-6'
          }
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-mono text-[11px] tracking-[0.06em] text-ink-muted uppercase">
              {tier.title}
            </h3>
            {tier.highlight && (
              <span className="font-mono text-[10px] tracking-[0.06em] text-signal uppercase">
                conseillé
              </span>
            )}
          </div>
          <p className="mt-3 font-mono text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">
            {tier.price}
          </p>
          <ul className="mt-4 flex flex-1 flex-col gap-2">
            {tier.lines.map((line) => (
              <li key={line} className="flex gap-2 text-[0.82rem] leading-snug text-ink-muted">
                <span aria-hidden className="mt-[0.42rem] size-1 shrink-0 bg-ink-faint" />
                {line}
              </li>
            ))}
          </ul>
          <a
            href={sponsorUrl}
            className={
              tier.highlight
                ? 'mt-5 rounded-[4px] bg-signal px-4 py-2 text-center font-mono text-[0.78rem] font-medium text-app transition-colors hover:bg-signal-strong'
                : 'mt-5 rounded-[4px] border border-line px-4 py-2 text-center font-mono text-[0.78rem] font-medium text-ink transition-colors hover:border-line-strong hover:bg-hover'
            }
          >
            {tier.cta}
          </a>
        </li>
      ))}
    </ul>
  );
}
