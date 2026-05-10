import { ExternalLink, Link as LinkIcon } from 'lucide-react';

import type { ProfileData } from '@/types/profile-data';

type Props = { projects: ProfileData['projects'] };

export function ProjectsSection({ projects }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2
        className="m-0 font-medium"
        style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
      >
        Projects
      </h2>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {projects.map(p => (
          <li
            key={p.id}
            className="flex flex-col gap-3 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {p.githubUrl || p.liveUrl ? (
                  <a
                    href={p.liveUrl || p.githubUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-0 font-medium hover:underline"
                    style={{ fontSize: 'var(--t-base)', color: 'var(--brand)' }}
                  >
                    {p.title}
                  </a>
                ) : (
                  <p className="m-0 font-medium" style={{ fontSize: 'var(--t-base)' }}>
                    {p.title}
                  </p>
                )}
              </div>
            </div>

            {p.description && (
              <p
                className="m-0 line-clamp-2"
                style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
              >
                {p.description}
              </p>
            )}

            {p.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.techStack.map(tech => (
                  <span
                    key={tech}
                    className="rounded bg-[var(--paper-3)] px-2 py-0.5 text-xs"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs hover:underline"
                  style={{ color: 'var(--ink-3)' }}
                >
                  <LinkIcon size={12} /> GitHub
                </a>
              )}
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs hover:underline"
                  style={{ color: 'var(--ink-3)' }}
                >
                  <ExternalLink size={12} /> Live
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
