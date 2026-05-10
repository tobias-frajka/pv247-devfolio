import type { ProfileData } from '@/types/profile-data';

type Props = { skills: ProfileData['skills'] };

export function SkillsSection({ skills }: Props) {
  const skillsByCategory = skills.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const categories = Object.keys(skillsByCategory).sort();

  return (
    <section className="flex flex-col gap-4">
      <h2
        className="m-0 font-medium"
        style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
      >
        Skills
      </h2>

      <div className="flex flex-col gap-6">
        {categories.map(category => (
          <div key={category} className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
            <div
              className="m-0"
              style={{
                fontSize: 'var(--t-xs)',
                fontWeight: 600,
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              {category}
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category].map(skillName => (
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
