import { requireUsername } from '@/lib/dal';
import {
  getDashboardData,
  toExperienceSummaries,
  toProfileSeed,
  toProjectSummaries,
  toSkillSummaries,
  toSocialSummaries
} from '@/lib/queries/dashboard';

import { ProjectsClient } from './projects-client';

export default async function ProjectsPage() {
  const session = await requireUsername();
  const data = await getDashboardData(session.user.id);

  return (
    <ProjectsClient
      projects={toProjectSummaries(data?.projects ?? [])}
      username={session.user.username}
      fallbackName={session.user.name}
      fallbackAvatar={session.user.image ?? null}
      previewSeed={{
        profile: toProfileSeed(data?.profile ?? null),
        experiences: toExperienceSummaries(data?.experiences ?? []),
        skills: toSkillSummaries(data?.skills ?? []),
        socials: toSocialSummaries(data?.socials ?? [])
      }}
    />
  );
}
