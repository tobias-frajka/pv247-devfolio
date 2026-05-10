export type CompletenessItemId =
  | 'displayName'
  | 'headline'
  | 'bio'
  | 'avatar'
  | 'projects1'
  | 'projects3'
  | 'skills5'
  | 'experience1'
  | 'social1';

export type CompletenessItem = {
  id: CompletenessItemId;
  points: number;
  href: string;
  label: string;
  met: boolean;
};

export type CompletenessResult = {
  score: number;
  items: CompletenessItem[];
  nextItem: CompletenessItem | null;
};

export type CompletenessData = {
  profile: {
    displayName: string | null;
    headline: string | null;
    bio: string | null;
    avatarUrl: string | null;
  } | null;
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  socialCount: number;
};

const trimmedLength = (value: string | null | undefined) => (value ?? '').trim().length;

const pluralizeNoun = (n: number, singular: string, plural: string) =>
  n === 1 ? `1 ${singular}` : `${n} ${plural}`;

export const calculateCompleteness = (data: CompletenessData): CompletenessResult => {
  const { profile, projectCount, skillCount, experienceCount, socialCount } = data;

  const items: CompletenessItem[] = [
    {
      id: 'displayName',
      points: 10,
      href: '/dashboard/profile',
      label: 'Add your display name to gain +10.',
      met: trimmedLength(profile?.displayName) > 0
    },
    {
      id: 'headline',
      points: 10,
      href: '/dashboard/profile',
      label: 'Add a headline to gain +10.',
      met: trimmedLength(profile?.headline) > 0
    },
    {
      id: 'bio',
      points: 15,
      href: '/dashboard/profile',
      label: 'Write a 40+ character bio to gain +15.',
      met: trimmedLength(profile?.bio) >= 40
    },
    {
      id: 'avatar',
      points: 5,
      href: '/dashboard/profile',
      label: 'Add an avatar URL to gain +5.',
      met: trimmedLength(profile?.avatarUrl) > 0
    },
    {
      id: 'projects1',
      points: 15,
      href: '/dashboard/projects',
      label: 'Add a project to gain +15.',
      met: projectCount >= 1
    },
    {
      id: 'projects3',
      points: 10,
      href: '/dashboard/projects',
      label: `Add ${pluralizeNoun(Math.max(3 - projectCount, 0), 'more project', 'more projects')} to gain +10.`,
      met: projectCount >= 3
    },
    {
      id: 'skills5',
      points: 15,
      href: '/dashboard/skills',
      label: `Add ${pluralizeNoun(Math.max(5 - skillCount, 0), 'more skill', 'more skills')} to gain +15.`,
      met: skillCount >= 5
    },
    {
      id: 'experience1',
      points: 10,
      href: '/dashboard/experience',
      label: 'Add a work entry to gain +10.',
      met: experienceCount >= 1
    },
    {
      id: 'social1',
      points: 10,
      href: '/dashboard/socials',
      label: 'Add a social link to gain +10.',
      met: socialCount >= 1
    }
  ];

  const score = items.reduce((sum, item) => sum + (item.met ? item.points : 0), 0);
  const nextItem = items.find(item => !item.met) ?? null;

  return { score, items, nextItem };
};
