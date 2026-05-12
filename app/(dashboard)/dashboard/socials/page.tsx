import { requireUsername } from '@/lib/dal';
import {
  getDashboardData,
  toExperienceSummaries,
  toProfileSeed,
  toProjectSummaries,
  toSkillSummaries,
  toSocialSummaries
} from '@/lib/queries/dashboard';

import { SocialsForm } from './socials-form';

export default async function SocialsPage() {
  const session = await requireUsername();
  const data = await getDashboardData(session.user.id);

  return (
    <SocialsForm
      initialSocials={toSocialSummaries(data?.socials ?? [])}
      username={session.user.username}
      fallbackName={session.user.name}
      fallbackAvatar={session.user.image ?? null}
      previewSeed={{
        profile: toProfileSeed(data?.profile ?? null),
        projects: toProjectSummaries(data?.projects ?? []),
        experiences: toExperienceSummaries(data?.experiences ?? []),
        skills: toSkillSummaries(data?.skills ?? [])
      }}
    />
  );
}
