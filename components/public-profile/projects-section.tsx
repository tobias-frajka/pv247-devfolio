import { ExternalLink, Link as LinkIcon } from 'lucide-react';

import { safeHttpUrl } from '@/lib/safe-url';
import type { ProfileData } from '@/types/profile-data';

type Props = { projects: ProfileData['projects'] };

export function ProjectsSection({ projects }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-[length:var(--t-2xl)] font-medium tracking-[-0.012em]">Projects</h2>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {projects.map(p => {
          const safeGithub = safeHttpUrl(p.githubUrl);
          const safeLive = safeHttpUrl(p.liveUrl);
          return (
            <li
              key={p.id}
              className="flex flex-col gap-3 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
            >
              <p className="m-0 text-[length:var(--t-base)] font-medium">{p.title}</p>

              {p.description && (
                <p className="m-0 line-clamp-2 text-[length:var(--t-sm)] text-[var(--ink-2)]">
                  {p.description}
                </p>
              )}

              {p.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.techStack.map(tech => (
                    <span
                      key={tech}
                      className="rounded bg-[var(--paper-3)] px-2 py-0.5 text-xs text-[var(--ink-2)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {(safeGithub || safeLive) && (
                <div className="flex gap-3 pt-2">
                  {safeGithub && (
                    <a
                      href={safeGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--ink-3)] hover:underline"
                    >
                      <LinkIcon size={12} /> GitHub
                    </a>
                  )}
                  {safeLive && (
                    <a
                      href={safeLive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--ink-3)] hover:underline"
                    >
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
