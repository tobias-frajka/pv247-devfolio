'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { useCheckLinksMutation } from '@/hooks/use-check-links-mutation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LinkResult, LinkSource, LinkStatus } from '@/server-actions/links';

function statusToBadge(r: LinkResult): { variant: 'ok' | 'warn' | 'danger'; label: string } {
  switch (r.status) {
    case 'ok':
      return { variant: 'ok', label: 'ok' };
    case 'broken':
      return {
        variant: 'danger',
        label: r.httpStatus ? `${r.httpStatus} broken` : 'broken'
      };
    case 'server-error':
      return {
        variant: 'warn',
        label: r.httpStatus ? `${r.httpStatus} server error` : 'server error'
      };
    case 'unreachable':
      return { variant: 'danger', label: 'unreachable' };
  }
}

function editHref(source: LinkSource, targetId: string): string {
  if (source === 'project') return `/dashboard/projects#project-${targetId}`;
  if (source === 'social') return `/dashboard/socials#social-${targetId}`;
  return '/dashboard/profile#avatar';
}

function summarize(results: LinkResult[]): string {
  const counts: Record<LinkStatus, number> = {
    broken: 0,
    unreachable: 0,
    'server-error': 0,
    ok: 0
  };
  for (const r of results) counts[r.status] += 1;

  const parts: string[] = [];
  if (counts.broken) parts.push(`${counts.broken} broken`);
  if (counts.unreachable) parts.push(`${counts.unreachable} unreachable`);
  if (counts['server-error']) parts.push(`${counts['server-error']} server error`);
  if (counts.ok) parts.push(`${counts.ok} ok`);
  return parts.join(' · ');
}

const labelStyle = { fontSize: 'var(--t-sm)', color: 'var(--ink-2)' } as const;

export function LinkCheckCard() {
  const mutation = useCheckLinksMutation();
  const results = mutation.data;

  const buttonLabel = mutation.isPending
    ? 'Checking…'
    : results && results.length > 0
      ? 'Re-run'
      : 'Run';

  const hasIssues = results?.some(r => r.status !== 'ok') ?? false;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
      {hasIssues && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: 'var(--warn)' }}
        />
      )}
      <div className="mb-3 flex items-center justify-between">
        <div className="eyebrow">link checker</div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {buttonLabel}
        </Button>
      </div>

      {mutation.isIdle && (
        <p className="m-0" style={labelStyle}>
          Run a check on your project, social, and avatar links.
        </p>
      )}

      {mutation.isPending && (
        <p className="m-0 font-mono" style={{ ...labelStyle, fontSize: 'var(--t-xs)' }}>
          Checking…
        </p>
      )}

      {mutation.isError && (
        <p className="m-0" style={{ ...labelStyle, color: 'var(--danger)' }}>
          Couldn&apos;t run the check. {mutation.error.message}
        </p>
      )}

      {mutation.isSuccess && results && results.length === 0 && (
        <p className="m-0" style={labelStyle}>
          No links to check yet. Add a project, social, or avatar URL.
        </p>
      )}

      {mutation.isSuccess && results && results.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="m-0 font-mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
            {summarize(results)}
          </p>
          <ul className="m-0 flex list-none flex-col p-0">
            {results.map(r => {
              const badge = statusToBadge(r);
              return (
                <li
                  key={`${r.source}-${r.targetId}-${r.url}`}
                  className="border-b border-[var(--hairline-soft)] py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <p
                    className="m-0 truncate font-medium"
                    style={{ fontSize: 'var(--t-sm)', color: 'var(--ink)' }}
                  >
                    {r.label}
                  </p>
                  <p
                    className="m-0 truncate font-mono"
                    title={r.url}
                    style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
                  >
                    {r.url}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    {r.status !== 'ok' && (
                      <Button asChild size="xs" variant="ghost" className="-mr-1 h-6 px-2">
                        <Link href={editHref(r.source, r.targetId)}>
                          Edit
                          <ArrowRight size={12} />
                        </Link>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
