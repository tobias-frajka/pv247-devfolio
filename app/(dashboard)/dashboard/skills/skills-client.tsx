'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SKILL_CATEGORIES, type SkillCategory } from '@/db/schema/skill';
import { addSkill, removeSkill } from '@/server-actions/skill';

type Skill = { id: string; name: string; category: SkillCategory };

type Suggestion = { name: string; category: SkillCategory };

type Props = {
  skills: Skill[];
  suggestions: Suggestion[];
};

function CategorySection({
  category,
  skills,
  onRemove,
  onAdd,
  removingId,
  pendingAdd
}: {
  category: SkillCategory;
  skills: Skill[];
  onRemove: (id: string) => void;
  onAdd: (name: string, category: SkillCategory) => void;
  removingId: string | null;
  pendingAdd: boolean;
}) {
  const [input, setInput] = useState('');

  const submit = () => {
    const name = input.trim();
    if (!name) return;
    onAdd(name, category);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="eyebrow">{category}</div>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <span
            key={s.id}
            className="flex items-center gap-1.5 rounded-md border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1 text-sm"
          >
            {s.name}
            <button
              type="button"
              className="flex items-center text-[var(--ink-3)] hover:text-[var(--ink)]"
              onClick={() => onRemove(s.id)}
              disabled={removingId === s.id}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={`Add ${category.toLowerCase()} skill…`}
          className="max-w-sm"
          disabled={pendingAdd}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={submit}
          disabled={pendingAdd || !input.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export function SkillsClient({ skills, suggestions }: Props) {
  const router = useRouter();
  const [suggestionCategories, setSuggestionCategories] = useState<Record<string, SkillCategory>>(
    Object.fromEntries(suggestions.map(s => [s.name, s.category]))
  );

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => router.refresh()
  });

  const removeMutation = useMutation({
    mutationFn: removeSkill,
    onSuccess: () => router.refresh()
  });

  const handleAdd = (name: string, category: SkillCategory) => {
    addMutation.mutate({ name, category });
  };

  const handleRemove = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleAddSuggestion = (name: string) => {
    const category = suggestionCategories[name] ?? 'Tools';
    addMutation.mutate({ name, category });
  };

  const handleChangeSuggestionCategory = (name: string, category: SkillCategory) => {
    setSuggestionCategories(prev => ({ ...prev, [name]: category }));
  };

  const skillsByCategory = SKILL_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter(s => s.category === cat);
      return acc;
    },
    {} as Record<SkillCategory, Skill[]>
  );

  const removingId =
    removeMutation.isPending && typeof removeMutation.variables === 'string'
      ? removeMutation.variables
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Skills
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
          Group your skills by category. Press Enter or click Add to add one.
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
          <div className="eyebrow mb-3">Suggested from your projects</div>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {suggestions.map(s => (
              <li key={s.name} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm">{s.name}</span>
                <select
                  className="focus-visible:border-ring rounded-md border border-[var(--hairline)] bg-[var(--paper)] px-2 py-1 text-xs outline-none"
                  value={suggestionCategories[s.name] ?? 'Tools'}
                  onChange={e =>
                    handleChangeSuggestionCategory(s.name, e.target.value as SkillCategory)
                  }
                >
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  disabled={addMutation.isPending}
                  onClick={() => handleAddSuggestion(s.name)}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {SKILL_CATEGORIES.map(cat => (
          <CategorySection
            key={cat}
            category={cat}
            skills={skillsByCategory[cat]}
            onAdd={handleAdd}
            onRemove={handleRemove}
            removingId={removingId}
            pendingAdd={addMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
