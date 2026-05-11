import type { ProfileData } from '@/types/profile-data';

type Props = { experiences: ProfileData['experiences'] };

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

function formatDate(start: Date, end: Date | null) {
  return `${dateFmt.format(start)} — ${end ? dateFmt.format(end) : 'Present'}`;
}

export function ExperienceSection({ experiences }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-[length:var(--t-2xl)] font-medium tracking-[-0.012em]">Experience</h2>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {experiences.map(e => (
          <li
            key={e.id}
            className="flex flex-col gap-2 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[length:var(--t-base)] font-medium">{e.role}</p>
                <p className="m-0 mt-0.5 text-[length:var(--t-sm)] text-[var(--ink-2)]">
                  {e.company}
                </p>
              </div>

              <p className="m-0 text-right font-mono text-[length:var(--t-xs)] whitespace-nowrap text-[var(--ink-3)]">
                {formatDate(e.startDate, e.endDate)}
              </p>
            </div>

            {e.description && (
              <p className="m-0 mt-1 line-clamp-2 text-[length:var(--t-xs)] text-[var(--ink-2)]">
                {e.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
