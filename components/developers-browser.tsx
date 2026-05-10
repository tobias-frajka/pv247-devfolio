'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  experienceCount: number;
};

type SortField = 'name' | 'experience' | 'projects' | 'availability';

export function DevelopersBrowser({ initialUsers }: { initialUsers: Developer[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [minExperience, setMinExperience] = useState(0);
  const [minProjects, setMinProjects] = useState(0);
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort developers
  const filteredDevelopers = useMemo(() => {
    let results = [...initialUsers];

    // Search by name/headline/bio
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        dev =>
          dev.displayName.toLowerCase().includes(query) ||
          dev.username.toLowerCase().includes(query) ||
          dev.headline.toLowerCase().includes(query) ||
          dev.bio.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (filterAvailableOnly) {
      results = results.filter(dev => dev.availableForWork);
    }

    // Filter by minimum experience
    if (minExperience > 0) {
      results = results.filter(dev => dev.yearsOfExperience >= minExperience);
    }

    // Filter by minimum projects
    if (minProjects > 0) {
      results = results.filter(dev => dev.projectCount >= minProjects);
    }

    // Sort
    results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.displayName.localeCompare(b.displayName);
          break;
        case 'experience':
          comparison = a.yearsOfExperience - b.yearsOfExperience;
          break;
        case 'projects':
          comparison = a.projectCount - b.projectCount;
          break;
        case 'availability':
          comparison = (a.availableForWork ? 1 : 0) - (b.availableForWork ? 1 : 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [
    searchQuery,
    filterAvailableOnly,
    minExperience,
    minProjects,
    sortBy,
    sortDirection,
    initialUsers
  ]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Search developers by name, headline, or bio..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Min. Years of Experience</label>
          <Input
            type="number"
            min="0"
            max="50"
            value={minExperience}
            onChange={e => setMinExperience(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="Years"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Min. Projects</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={minProjects}
            onChange={e => setMinProjects(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="Count"
          />
        </div>

        <div className="flex flex-col justify-end">
          <Button
            variant={filterAvailableOnly ? 'default' : 'outline'}
            onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
            className="w-full"
          >
            {filterAvailableOnly ? '✓ Available Only' : 'All Availability'}
          </Button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Sort by</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortField)}
            className="w-full rounded-md border border-[var(--input)] bg-black px-3 py-2 text-sm text-gray-400 outline-none"
          >
            <option value="name">Name</option>
            <option value="experience">Experience</option>
            <option value="projects">Projects</option>
            <option value="availability">Availability</option>
          </select>
        </div>
      </div>

      {/* Sort Direction Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Button>
        <span className="text-sm" style={{ color: 'var(--ink-3)' }}>
          {filteredDevelopers.length} {filteredDevelopers.length === 1 ? 'developer' : 'developers'}
        </span>
      </div>

      {/* Developers Table */}
      {filteredDevelopers.length === 0 ? (
        <div className="py-12 text-center">
          <p style={{ fontSize: 'var(--t-lg)', color: 'var(--ink-2)' }}>
            No developers found matching your criteria
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-x-auto">
          {filteredDevelopers.map(dev => (
            <Card
              key={dev.id}
              className="rounded-[10px] border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-3 transition-all hover:bg-[var(--paper-3)]"
            >
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                {dev.avatarUrl && (
                  <img
                    src={dev.avatarUrl}
                    alt={dev.displayName}
                    className="h-12 w-12 flex-shrink-0 rounded-full border border-[var(--hairline)] object-cover"
                  />
                )}
                {!dev.avatarUrl && (
                  <div className="h-12 w-12 flex-shrink-0 rounded-full border border-[var(--hairline)] bg-[var(--ink-3)] opacity-20" />
                )}

                {/* Name and Headline */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${dev.username}`}
                    className="hover:text-primary font-medium transition-colors"
                    style={{ fontSize: 'var(--t-base)' }}
                  >
                    {dev.displayName}
                  </Link>
                  {dev.headline && (
                    <p
                      className="m-0 truncate"
                      style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
                    >
                      {dev.headline}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="hidden flex-shrink-0 text-right lg:block">
                  {dev.location ? (
                    <div className="flex items-center justify-end gap-1">
                      <MapPin size={14} style={{ color: 'var(--ink-2)' }} />
                      <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
                        {dev.location}
                      </p>
                    </div>
                  ) : (
                    <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-3)' }}>
                      —
                    </p>
                  )}
                </div>

                {/* Years of Experience */}
                <div className="hidden flex-shrink-0 text-center sm:block">
                  <p className="m-0 font-medium" style={{ fontSize: 'var(--t-sm)' }}>
                    {dev.yearsOfExperience}
                  </p>
                  <p className="m-0" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
                    years of experience
                  </p>
                </div>

                {/* Project Count */}
                <div className="hidden flex-shrink-0 text-center sm:block">
                  <p className="m-0 font-medium" style={{ fontSize: 'var(--t-sm)' }}>
                    {dev.projectCount}
                  </p>
                  <p className="m-0" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
                    projects
                  </p>
                </div>

                {/* Available for Work */}
                <div className="hidden flex-shrink-0 text-center md:block">
                  {dev.availableForWork ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--brand)] bg-[var(--brand-ghost)] px-2 py-0.5">
                      <span className="text-[var(--brand)]" style={{ fontSize: 'var(--t-xs)' }}>
                        ✓ Available
                      </span>
                    </div>
                  ) : (
                    <p className="m-0" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
                      —
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
