import { requireUsername } from '@/lib/dal';
import {
  getDashboardData,
  toExperienceSummaries,
  toProfileSeed,
  toProjectSummaries,
  toSkillSummaries,
  toSocialSummaries
} from '@/lib/queries/dashboard';

import { ExperienceClient } from './experience-client';

export default async function ExperiencePage() {
  const session = await requireUsername();
  const data = await getDashboardData(session.user.id);

  return (
    <ExperienceClient
      experiences={toExperienceSummaries(data?.experiences ?? [])}
      username={session.user.username}
      fallbackName={session.user.name}
      fallbackAvatar={session.user.image ?? null}
      previewSeed={{
        profile: toProfileSeed(data?.profile ?? null),
        projects: toProjectSummaries(data?.projects ?? []),
        skills: toSkillSummaries(data?.skills ?? []),
        socials: toSocialSummaries(data?.socials ?? [])
      }}
    />
  );
}
