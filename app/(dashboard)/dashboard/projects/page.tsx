import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { project } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { ProjectsClient } from './projects-client';

export default async function ProjectsPage() {
  const session = await requireUsername();

  const projects = await db.query.project.findMany({
    where: eq(project.userId, session.user.id),
    orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
  });

  return (
    <ProjectsClient
      projects={projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        techStack: p.techStack ?? [],
        githubUrl: p.githubUrl ?? null,
        liveUrl: p.liveUrl ?? null
      }))}
    />
  );
}
