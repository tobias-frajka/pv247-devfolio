import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { project, skill } from '@/db/schema';
import type { SkillCategory } from '@/db/schema/skill';
import { requireUsername } from '@/lib/dal';

import { SkillsClient } from './skills-client';

export default async function SkillsPage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [skills, projects] = await Promise.all([
    db.query.skill.findMany({ where: eq(skill.userId, userId) }),
    db.query.project.findMany({ where: eq(project.userId, userId) })
  ]);

  const skillNames = new Set(skills.map(s => s.name.toLowerCase()));

  const allTechTags = projects.flatMap(p => p.techStack ?? []);
  const uniqueTags = [...new Set(allTechTags)];
  const suggestions = uniqueTags
    .filter(tag => !skillNames.has(tag.toLowerCase()))
    .map(name => ({ name, category: 'Tools' as SkillCategory }));

  return (
    <SkillsClient
      skills={skills.map(s => ({ id: s.id, name: s.name, category: s.category }))}
      suggestions={suggestions}
    />
  );
}
