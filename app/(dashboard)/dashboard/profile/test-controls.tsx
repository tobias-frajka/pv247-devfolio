'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { type SkillCategory, SKILL_CATEGORIES } from '@/db/schema/skill';
import { type SocialPlatform, SOCIAL_PLATFORMS } from '@/db/schema/social';
import { generateBio, improveDescription, suggestTitles } from '@/server-actions/ai';
import { checkLinks, type LinkResult } from '@/server-actions/links';
import { upsertProfile } from '@/server-actions/profile';
import { createProject, deleteProject } from '@/server-actions/project';
import { addSkill, removeSkill } from '@/server-actions/skill';
import { removeSocial, upsertSocial } from '@/server-actions/social';

type ProfileState = {
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  availableForWork: boolean;
} | null;

type Props = {
  profile: ProfileState;
  projects: { id: string; title: string }[];
  skills: { id: string; name: string; category: SkillCategory }[];
  socials: { id: string; platform: SocialPlatform; url: string }[];
};

const sectionStyle = 'rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4';
const labelStyle = { fontSize: 'var(--t-sm)', color: 'var(--ink-2)' } as const;
const inputClass =
  'w-full rounded-md border border-[var(--hairline)] bg-[var(--paper)] px-2 py-1.5 font-mono outline-none focus-within:border-ring';
const outputClass =
  'rounded-md border border-[var(--hairline-soft)] bg-[var(--paper)] p-3 font-mono whitespace-pre-wrap';

export function TestControls({ profile, projects, skills, socials }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ProfileSection initial={profile} />
      <AiSection skills={skills} />
      <ProjectSection projects={projects} />
      <SkillSection skills={skills} />
      <SocialSection socials={socials} />
      <LinkCheckSection />
    </div>
  );
}

function ProfileSection({ initial }: { initial: ProfileState }) {
  const [pending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(initial?.displayName ?? '');
  const [headline, setHeadline] = useState(initial?.headline ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [availableForWork, setAvailable] = useState(initial?.availableForWork ?? false);
  const [result, setResult] = useState<string>('');

  const onSubmit = () =>
    startTransition(async () => {
      try {
        const row = await upsertProfile({ displayName, headline, bio, availableForWork });
        setResult(JSON.stringify(row, null, 2));
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">upsertProfile</div>
      <div className="flex flex-col gap-2">
        <label style={labelStyle}>
          displayName
          <input
            className={inputClass}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </label>
        <label style={labelStyle}>
          headline
          <input
            className={inputClass}
            value={headline}
            onChange={e => setHeadline(e.target.value)}
          />
        </label>
        <label style={labelStyle}>
          bio
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2" style={labelStyle}>
          <input
            type="checkbox"
            checked={availableForWork}
            onChange={e => setAvailable(e.target.checked)}
          />
          availableForWork
        </label>
        <Button type="button" disabled={pending} onClick={onSubmit}>
          {pending ? 'Saving…' : 'upsertProfile'}
        </Button>
        {result && <pre className={outputClass}>{result}</pre>}
      </div>
    </section>
  );
}

function AiSection({ skills }: { skills: Props['skills'] }) {
  const [pending, startTransition] = useTransition();
  const [output, setOutput] = useState('');

  const [role, setRole] = useState('Backend Engineer');
  const [years, setYears] = useState(3);

  const [projectTitle, setProjectTitle] = useState('DevFolio');
  const [projectDescription, setProjectDescription] = useState(
    'Portfolio builder with github auth, drizzle and openrouter ai assists.'
  );

  const run = (label: string, fn: () => Promise<unknown>) =>
    startTransition(async () => {
      setOutput(`${label}…`);
      try {
        const result = await fn();
        setOutput(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      } catch (err) {
        setOutput(`${label} error: ${err instanceof Error ? err.message : String(err)}`);
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">openrouter ai</div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <label style={labelStyle}>
            role
            <input className={inputClass} value={role} onChange={e => setRole(e.target.value)} />
          </label>
          <label style={labelStyle}>
            years
            <input
              type="number"
              className={inputClass}
              value={years}
              onChange={e => setYears(Number(e.target.value))}
            />
          </label>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            run('generateBio', () =>
              generateBio({ role, yearsExperience: years, topSkills: skills.map(s => s.name).slice(0, 3) })
            )
          }
        >
          generateBio
        </Button>

        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            project title
            <input
              className={inputClass}
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
            />
          </label>
          <label style={labelStyle}>
            project description
            <textarea
              className={`${inputClass} min-h-[60px]`}
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run('improveDescription', () =>
                improveDescription({
                  title: projectTitle,
                  techStack: ['typescript', 'next.js', 'drizzle'],
                  description: projectDescription
                })
              )
            }
          >
            improveDescription
          </Button>
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            run('suggestTitles', () =>
              suggestTitles({
                skills: skills.length
                  ? skills.map(s => ({ name: s.name, category: s.category }))
                  : [
                      { name: 'TypeScript', category: 'Frontend' },
                      { name: 'PostgreSQL', category: 'Backend' },
                      { name: 'Docker', category: 'Tools' }
                    ]
              })
            )
          }
        >
          suggestTitles
        </Button>

        {output && <pre className={outputClass}>{output}</pre>}
      </div>
    </section>
  );
}

function ProjectSection({ projects }: { projects: Props['projects'] }) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('typescript, react');
  const [result, setResult] = useState('');

  const onCreate = () =>
    startTransition(async () => {
      try {
        const row = await createProject({
          title,
          description,
          techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
          githubUrl: '',
          liveUrl: ''
        });
        setResult(JSON.stringify(row, null, 2));
        setTitle('');
        setDescription('');
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  const onDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteProject(id);
        setResult(`deleted ${id}`);
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">project crud</div>
      <div className="flex flex-col gap-2">
        <label style={labelStyle}>
          title
          <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label style={labelStyle}>
          description
          <input
            className={inputClass}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <label style={labelStyle}>
          techStack (comma-separated)
          <input
            className={inputClass}
            value={techStack}
            onChange={e => setTechStack(e.target.value)}
          />
        </label>
        <Button type="button" disabled={pending || !title || !description} onClick={onCreate}>
          createProject
        </Button>
        {projects.length > 0 && (
          <ul className="m-0 mt-2 list-none p-0" style={labelStyle}>
            {projects.map(p => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-1">
                <span className="font-mono">{p.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={pending}
                  onClick={() => onDelete(p.id)}
                >
                  delete
                </Button>
              </li>
            ))}
          </ul>
        )}
        {result && <pre className={outputClass}>{result}</pre>}
      </div>
    </section>
  );
}

function SkillSection({ skills }: { skills: Props['skills'] }) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Frontend');
  const [result, setResult] = useState('');

  const onAdd = () =>
    startTransition(async () => {
      try {
        const row = await addSkill({ name, category });
        setResult(JSON.stringify(row, null, 2));
        setName('');
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  const onRemove = (id: string) =>
    startTransition(async () => {
      try {
        await removeSkill(id);
        setResult(`removed ${id}`);
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">skill crud</div>
      <div className="flex flex-col gap-2">
        <label style={labelStyle}>
          name
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label style={labelStyle}>
          category
          <select
            className={inputClass}
            value={category}
            onChange={e => setCategory(e.target.value as SkillCategory)}
          >
            {SKILL_CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" disabled={pending || !name} onClick={onAdd}>
          addSkill
        </Button>
        {skills.length > 0 && (
          <ul className="m-0 mt-2 list-none p-0" style={labelStyle}>
            {skills.map(s => (
              <li key={s.id} className="flex items-center justify-between gap-2 py-1">
                <span className="font-mono">
                  {s.name} <span style={{ color: 'var(--ink-3)' }}>· {s.category}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={pending}
                  onClick={() => onRemove(s.id)}
                >
                  remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        {result && <pre className={outputClass}>{result}</pre>}
      </div>
    </section>
  );
}

function SocialSection({ socials }: { socials: Props['socials'] }) {
  const [pending, startTransition] = useTransition();
  const [platform, setPlatform] = useState<SocialPlatform>('github');
  const [url, setUrl] = useState('https://github.com/');
  const [result, setResult] = useState('');

  const onUpsert = () =>
    startTransition(async () => {
      try {
        const row = await upsertSocial({ platform, url });
        setResult(JSON.stringify(row, null, 2));
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  const onRemove = (p: SocialPlatform) =>
    startTransition(async () => {
      try {
        await removeSocial(p);
        setResult(`removed ${p}`);
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">social upsert / remove</div>
      <div className="flex flex-col gap-2">
        <label style={labelStyle}>
          platform
          <select
            className={inputClass}
            value={platform}
            onChange={e => setPlatform(e.target.value as SocialPlatform)}
          >
            {SOCIAL_PLATFORMS.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          url
          <input className={inputClass} value={url} onChange={e => setUrl(e.target.value)} />
        </label>
        <Button type="button" disabled={pending || !url} onClick={onUpsert}>
          upsertSocial
        </Button>
        {socials.length > 0 && (
          <ul className="m-0 mt-2 list-none p-0" style={labelStyle}>
            {socials.map(s => (
              <li key={s.id} className="flex items-center justify-between gap-2 py-1">
                <span className="font-mono">
                  {s.platform} <span style={{ color: 'var(--ink-3)' }}>· {s.url}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={pending}
                  onClick={() => onRemove(s.platform)}
                >
                  remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        {result && <pre className={outputClass}>{result}</pre>}
      </div>
    </section>
  );
}

function LinkCheckSection() {
  const [pending, startTransition] = useTransition();
  const [results, setResults] = useState<LinkResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCheck = () =>
    startTransition(async () => {
      setError(null);
      try {
        const out = await checkLinks();
        setResults(out);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });

  return (
    <section className={sectionStyle}>
      <div className="eyebrow mb-3">link checker</div>
      <div className="flex flex-col gap-2">
        <Button type="button" disabled={pending} onClick={onCheck}>
          {pending ? 'Checking…' : 'checkLinks'}
        </Button>
        {error && (
          <p className="m-0" style={{ ...labelStyle, color: 'var(--danger)' }}>
            {error}
          </p>
        )}
        {results && results.length === 0 && (
          <p className="m-0" style={labelStyle}>
            (no urls to check — add a project with a github url first)
          </p>
        )}
        {results && results.length > 0 && (
          <ul className="m-0 list-none p-0 font-mono" style={{ fontSize: 'var(--t-sm)' }}>
            {results.map(r => (
              <li key={`${r.source}-${r.url}`} className="py-1">
                <span style={{ color: 'var(--ink-3)' }}>[{r.status}]</span> {r.label} —{' '}
                <a className="underline" href={r.url} target="_blank" rel="noreferrer">
                  {r.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
