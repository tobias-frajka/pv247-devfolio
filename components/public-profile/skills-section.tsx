import { SKILL_CATEGORIES, type SkillCategory } from '@/db/schema';
import type { ProfileData } from '@/types/profile-data';

type Props = { skills: ProfileData['skills'] };

export function SkillsSection({ skills }: Props) {
  const skillsByCategory = skills.reduce(
    (acc, s) => {
      (acc[s.category] ??= []).push(s.name);
      return acc;
    },
    {} as Partial<Record<SkillCategory, string[]>>
  );

  const presentCategories = SKILL_CATEGORIES.filter(c => skillsByCategory[c]?.length);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-[length:var(--t-2xl)] font-medium tracking-[-0.012em]">Skills</h2>

      <div className="flex flex-col gap-6">
        {presentCategories.map(category => (
          <div key={category} className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
            <div className="m-0 text-[length:var(--t-xs)] font-semibold tracking-[0.1em] text-[var(--ink-3)] uppercase">
              {category}
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category]?.map(skillName => (
                <span
                  key={skillName}
                  className="rounded border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1 text-xs"
                >
                  {skillName}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
