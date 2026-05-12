'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Search, Star, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Developer = {
  id: string;
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string | null;
  availableForWork: boolean;
  yearsOfExperience: number;
  projectCount: number;
  stars: number;
};

type MinYears = 'any' | 1 | 3 | 5 | 10;
type MinProjects = 'any' | 1 | 5 | 10;
type SortKey =
  | 'stars-desc'
  | 'stars-asc'
  | 'name-asc'
  | 'name-desc'
  | 'experience-desc'
  | 'experience-asc'
  | 'projects-desc'
  | 'projects-asc'
  | 'availability-desc';

type Filters = {
  search: string;
  minYears: MinYears;
  minProjects: MinProjects;
  availableOnly: boolean;
  sort: SortKey;
};

const YEAR_OPTIONS: ReadonlyArray<{ value: MinYears; label: string }> = [
  { value: 'any', label: 'Any experience' },
  { value: 1, label: '1+ years' },
  { value: 3, label: '3+ years' },
  { value: 5, label: '5+ years' },
  { value: 10, label: '10+ years' }
];

const PROJECT_OPTIONS: ReadonlyArray<{ value: MinProjects; label: string }> = [
  { value: 'any', label: 'Any projects' },
  { value: 1, label: '1+ projects' },
  { value: 5, label: '5+ projects' },
  { value: 10, label: '10+ projects' }
];

const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'stars-desc', label: 'Most stars' },
  { value: 'stars-asc', label: 'Fewest stars' },
  { value: 'name-asc', label: 'Name (A→Z)' },
  { value: 'name-desc', label: 'Name (Z→A)' },
  { value: 'experience-desc', label: 'Most experience' },
  { value: 'experience-asc', label: 'Least experience' },
  { value: 'projects-desc', label: 'Most projects' },
  { value: 'projects-asc', label: 'Fewest projects' },
  { value: 'availability-desc', label: 'Available first' }
];

const DEFAULT_FILTERS: Filters = {
  search: '',
  minYears: 'any',
  minProjects: 'any',
  availableOnly: false,
  sort: 'stars-desc'
};

function compareDevelopers(sort: SortKey): (a: Developer, b: Developer) => number {
  switch (sort) {
    case 'stars-desc':
      return (a, b) => b.stars - a.stars || a.username.localeCompare(b.username);
    case 'stars-asc':
      return (a, b) => a.stars - b.stars || a.username.localeCompare(b.username);
    case 'name-asc':
      return (a, b) => a.displayName.localeCompare(b.displayName);
    case 'name-desc':
      return (a, b) => b.displayName.localeCompare(a.displayName);
    case 'experience-desc':
      return (a, b) => b.yearsOfExperience - a.yearsOfExperience;
    case 'experience-asc':
      return (a, b) => a.yearsOfExperience - b.yearsOfExperience;
    case 'projects-desc':
      return (a, b) => b.projectCount - a.projectCount;
    case 'projects-asc':
      return (a, b) => a.projectCount - b.projectCount;
    case 'availability-desc':
      return (a, b) => Number(b.availableForWork) - Number(a.availableForWork) || b.stars - a.stars;
  }
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function avatarInitial(dev: Developer) {
  const source = dev.displayName?.trim() || dev.username;
  const ch = source.replace(/^@/, '').match(/[a-z0-9]/i)?.[0];
  return (ch ?? '·').toUpperCase();
}

function displaysAsHandle(dev: Developer) {
  const dn = dev.displayName?.trim();
  return !dn || dn.toLowerCase() === dev.username.toLowerCase();
}

function plural(n: number, sg: string, pl: string) {
  return n === 1 ? sg : pl;
}

export function DevelopersBrowser({ initialUsers }: { initialUsers: Developer[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const { search, minYears, minProjects, availableOnly, sort } = filters;
  const hasActiveFilters =
    search.trim() !== '' || minYears !== 'any' || minProjects !== 'any' || availableOnly;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return initialUsers
      .filter(dev => {
        if (query) {
          const hay =
            `${dev.displayName} ${dev.username} ${dev.headline} ${dev.bio} ${dev.location}`.toLowerCase();
          if (!hay.includes(query)) return false;
        }
        if (availableOnly && !dev.availableForWork) return false;
        if (minYears !== 'any' && dev.yearsOfExperience < minYears) return false;
        if (minProjects !== 'any' && dev.projectCount < minProjects) return false;
        return true;
      })
      .sort(compareDevelopers(sort));
  }, [initialUsers, search, minYears, minProjects, availableOnly, sort]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          size={16}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--ink-3)]"
        />
        <Input
          type="text"
          inputMode="search"
          placeholder="Search by name, username, headline, bio, or location"
          value={search}
          onChange={e => update('search', e.target.value)}
          className="h-11 pr-10 pl-10 text-[length:var(--t-base)]"
          aria-label="Search developers"
        />
        {search && (
          <button
            type="button"
            onClick={() => update('search', '')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[var(--ink-3)] transition-colors hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <ToolbarSelect
          label="Experience"
          value={minYears}
          onChange={v => update('minYears', v)}
          options={YEAR_OPTIONS}
          className="w-full sm:w-[240px]"
        />
        <ToolbarSelect
          label="Projects"
          value={minProjects}
          onChange={v => update('minProjects', v)}
          options={PROJECT_OPTIONS}
          className="w-full sm:w-[200px]"
        />
        <button
          type="button"
          onClick={() => update('availableOnly', !availableOnly)}
          aria-pressed={availableOnly}
          className={cn(
            'inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border px-3 text-[length:var(--t-sm)] transition-colors sm:w-auto sm:justify-start',
            availableOnly
              ? 'border-[var(--brand)] bg-[var(--brand-ghost)] text-[var(--brand)]'
              : 'border-[var(--hairline)] bg-transparent text-[var(--ink-2)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)]'
          )}
        >
          <span
            className={cn(
              'inline-block h-1.5 w-1.5 rounded-full transition-colors',
              availableOnly ? 'bg-[var(--brand)]' : 'bg-[var(--ink-3)]'
            )}
            aria-hidden
          />
          Open to work
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(prev => ({ ...DEFAULT_FILTERS, sort: prev.sort }))}
            aria-label="Clear all filters"
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
        )}

        <div className="w-full sm:ml-auto sm:w-auto">
          <ToolbarSelect
            label="Sort"
            value={sort}
            onChange={v => update('sort', v)}
            options={SORT_OPTIONS}
            className="w-full sm:w-[240px]"
          />
        </div>
      </div>

      <p className="eyebrow m-0 border-t border-[var(--hairline-soft)] pt-3">
        {filtered.length} {plural(filtered.length, 'developer', 'developers')}
        {filtered.length !== initialUsers.length && (
          <span className="ml-1.5 tracking-normal text-[var(--ink-3)] normal-case">
            of {initialUsers.length}
          </span>
        )}
      </p>

      {filtered.length === 0 ? (
        <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} hasFilters={hasActiveFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((dev, i) => (
            <DeveloperRow key={dev.id} dev={dev} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  className
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  className?: string;
}) {
  const currentLabel = options.find(o => o.value === value)?.label ?? '';
  return (
    <SelectRoot
      value={String(value)}
      onValueChange={next => {
        const match = options.find(o => String(o.value) === next);
        if (match) onChange(match.value);
      }}
    >
      <SelectTrigger aria-label={label} className={cn('justify-between', className)}>
        <span className="flex min-w-0 items-center gap-2">
          <span className="eyebrow m-0 flex-shrink-0 select-none">{label}</span>
          <SelectValue asChild>
            <span className="truncate text-[var(--ink)]">{currentLabel}</span>
          </SelectValue>
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={String(o.value)} value={String(o.value)}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

function DeveloperRow({ dev, index }: { dev: Developer; index: number }) {
  const handle = `@${dev.username}`;
  const showHandleAsPrimary = displaysAsHandle(dev);

  return (
    <Link
      href={`/${dev.username}`}
      className="reveal-rise group flex items-center gap-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-3 transition-all duration-150 hover:-translate-y-[1px] hover:border-[color-mix(in_oklch,var(--brand)_45%,var(--hairline))] hover:bg-[var(--paper-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Avatar dev={dev} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className={cn(
              'truncate text-[length:var(--t-base)] font-medium text-[var(--ink)]',
              showHandleAsPrimary && 'font-mono tracking-tight'
            )}
          >
            {showHandleAsPrimary ? handle : dev.displayName}
          </span>
          {!showHandleAsPrimary && (
            <span className="truncate font-mono text-[length:var(--t-xs)] text-[var(--ink-3)]">
              {handle}
            </span>
          )}
          {dev.availableForWork && <AvailableBadge />}
        </div>

        {dev.headline && (
          <p className="m-0 mt-0.5 truncate text-[length:var(--t-sm)] text-[var(--ink-2)]">
            {dev.headline}
          </p>
        )}

        {/* Stats inline beneath identity on narrow screens; on >=sm they move to the right cluster. */}
        <p className="m-0 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[length:var(--t-xs)] text-[var(--ink-3)] sm:hidden">
          <Stat icon="star" value={dev.stars} unit={plural(dev.stars, 'star', 'stars')} />
          <Middot />
          <Stat value={dev.yearsOfExperience} unit={plural(dev.yearsOfExperience, 'yr', 'yrs')} />
          <Middot />
          <Stat value={dev.projectCount} unit={plural(dev.projectCount, 'project', 'projects')} />
          {dev.location && (
            <>
              <Middot />
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} aria-hidden />
                {dev.location}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="hidden flex-shrink-0 items-center gap-5 sm:flex">
        {dev.location && (
          <span className="hidden items-center gap-1 text-[length:var(--t-sm)] text-[var(--ink-3)] lg:inline-flex">
            <MapPin size={13} aria-hidden />
            {dev.location}
          </span>
        )}
        <div className="flex items-center divide-x divide-[var(--hairline-soft)] font-mono text-[length:var(--t-sm)] text-[var(--ink-2)]">
          <Stat
            variant="cluster"
            icon="star"
            value={dev.stars}
            unit={plural(dev.stars, 'star', 'stars')}
          />
          <Stat
            variant="cluster"
            value={dev.yearsOfExperience}
            unit={plural(dev.yearsOfExperience, 'yr', 'yrs')}
          />
          <Stat
            variant="cluster"
            value={dev.projectCount}
            unit={plural(dev.projectCount, 'project', 'projects')}
          />
        </div>
      </div>
    </Link>
  );
}

function Avatar({ dev }: { dev: Developer }) {
  if (dev.avatarUrl) {
    return (
      <Image
        src={dev.avatarUrl}
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className="h-12 w-12 flex-shrink-0 rounded-full border border-[var(--hairline)] object-cover"
      />
    );
  }

  const hue = hashString(dev.username) % 360;

  return (
    <div
      aria-hidden
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] font-mono text-[length:var(--t-base)] font-medium"
      style={{
        background: `oklch(0.28 0.05 ${hue})`,
        color: `oklch(0.92 0.08 ${hue})`
      }}
    >
      {avatarInitial(dev)}
    </div>
  );
}

function AvailableBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-[var(--brand)] bg-[var(--brand-ghost)] px-1.5 py-px text-[10px] leading-none font-medium tracking-[0.06em] text-[var(--brand)] uppercase"
      aria-label="Available for work"
    >
      <span className="inline-block h-1 w-1 rounded-full bg-[var(--brand)]" aria-hidden />
      Open
    </span>
  );
}

function Stat({
  variant = 'inline',
  icon,
  value,
  unit
}: {
  variant?: 'inline' | 'cluster';
  icon?: 'star';
  value: number;
  unit: string;
}) {
  if (variant === 'cluster') {
    return (
      <span className="inline-flex items-baseline gap-1 px-3 first:pl-0 last:pr-0">
        {icon === 'star' && (
          <Star size={12} className="self-center fill-current text-[var(--ink-2)]" aria-hidden />
        )}
        <span className="tabular-nums">{value}</span>
        <span className="text-[length:var(--t-xs)] text-[var(--ink-3)]">{unit}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      {icon === 'star' && (
        <Star size={11} className="fill-current text-[var(--ink-2)]" aria-hidden />
      )}
      <span className="text-[var(--ink-2)] tabular-nums">{value}</span>
      <span>{unit}</span>
    </span>
  );
}

function Middot() {
  return (
    <span aria-hidden className="text-[var(--ink-3)]/60">
      ·
    </span>
  );
}

function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-[var(--hairline)] bg-[var(--paper-2)]/40 px-6 py-14 text-center">
      <p className="eyebrow m-0">No matches</p>
      <p className="m-0 max-w-[420px] text-[length:var(--t-base)] text-[var(--ink-2)]">
        {hasFilters
          ? 'Nothing matches the current filters. Loosen them up and try again.'
          : 'No developer profiles yet — be the first to enlist.'}
      </p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      )}
    </div>
  );
}
