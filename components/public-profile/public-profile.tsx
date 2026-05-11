import type { StarContext } from '@/lib/queries/stars';
import type { ProfileData } from '@/types/profile-data';

import { ExperienceSection } from './experience-section';
import { HeroSection } from './hero-section';
import { ProjectsSection } from './projects-section';
import { SkillsSection } from './skills-section';
import { SocialsSection } from './socials-section';

export function PublicProfile({ data, stars }: { data: ProfileData; stars?: StarContext }) {
  return (
    <div className="bg-background min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[880px] flex-col gap-12">
        <HeroSection
          displayName={data.displayName}
          headline={data.headline}
          bio={data.bio}
          location={data.location}
          avatarUrl={data.avatarUrl}
          availableForWork={data.availableForWork}
          username={data.username}
          stars={stars}
        />

        {data.projects.length > 0 && <ProjectsSection projects={data.projects} />}
        {data.experiences.length > 0 && <ExperienceSection experiences={data.experiences} />}
        {data.skills.length > 0 && <SkillsSection skills={data.skills} />}
        {data.socials.length > 0 && <SocialsSection socials={data.socials} />}
      </div>
    </div>
  );
}
