import type { SkillCategory } from '@/db/schema/skill';
import type { SocialPlatform } from '@/db/schema/social';

export type ProfileData = {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string | null;
  availableForWork: boolean;
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string | null;
    liveUrl: string | null;
  }[];
  experiences: {
    id: string;
    company: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
  }[];
  skills: { id: string; name: string; category: SkillCategory }[];
  socials: { platform: SocialPlatform; url: string }[];
};
