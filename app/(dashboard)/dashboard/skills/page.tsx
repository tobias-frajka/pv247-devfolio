import type { SkillCategory } from '@/db/schema/skill';
import { requireUsername } from '@/lib/dal';
import {
  getDashboardData,
  toExperienceSummaries,
  toProfileSeed,
  toProjectSummaries,
  toSkillSummaries,
  toSocialSummaries
} from '@/lib/queries/dashboard';

import { SkillsClient } from './skills-client';

export default async function SkillsPage() {
  const session = await requireUsername();
  const data = await getDashboardData(session.user.id);

  const skills = data?.skills ?? [];
  const projects = data?.projects ?? [];

  const skillNames = new Set(skills.map(s => s.name.toLowerCase()));
  const allTechTags = projects.flatMap(p => p.techStack ?? []);
  const seenLower = new Map<string, string>();
  for (const tag of allTechTags) {
    const lower = tag.toLowerCase();
    if (!seenLower.has(lower)) seenLower.set(lower, tag);
  }
  const suggestions = [...seenLower.values()]
    .filter(tag => !skillNames.has(tag.toLowerCase()))
    .map(name => ({ name, category: 'Tools' as SkillCategory }));

  return (
    <SkillsClient
      skills={toSkillSummaries(skills)}
      suggestions={suggestions}
      username={session.user.username}
      fallbackName={session.user.name}
      fallbackAvatar={session.user.image ?? null}
      previewSeed={{
        profile: toProfileSeed(data?.profile ?? null),
        projects: toProjectSummaries(projects),
        experiences: toExperienceSummaries(data?.experiences ?? []),
        socials: toSocialSummaries(data?.socials ?? [])
      }}
    />
  );
}
