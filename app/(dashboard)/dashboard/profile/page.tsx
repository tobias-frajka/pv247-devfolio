import { requireUsername } from '@/lib/dal';
import {
  getDashboardData,
  toExperienceSummaries,
  toProjectSummaries,
  toSkillSummaries,
  toSocialSummaries
} from '@/lib/queries/dashboard';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await requireUsername();
  const data = await getDashboardData(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <ProfileForm
        initialProfile={data?.profile ?? null}
        username={session.user.username}
        fallbackName={session.user.name}
        fallbackAvatar={session.user.image ?? null}
        skills={(data?.skills ?? []).map(s => ({ name: s.name, category: s.category }))}
        otherSections={{
          projects: toProjectSummaries(data?.projects ?? []),
          experiences: toExperienceSummaries(data?.experiences ?? []),
          skills: toSkillSummaries(data?.skills ?? []),
          socials: toSocialSummaries(data?.socials ?? [])
        }}
      />
    </div>
  );
}
