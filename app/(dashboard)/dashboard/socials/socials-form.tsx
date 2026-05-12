'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link as LinkIcon, Briefcase, Globe, Mail, AtSign } from 'lucide-react';
import { toast } from 'sonner';

import { PreviewToggle, type PreviewMode } from '@/components/dashboard/preview-toggle';
import { PublicProfile } from '@/components/public-profile/public-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { PageDescription, PageTitle } from '@/components/ui/page-title';
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/db/schema/social';
import { httpUrl } from '@/schemas/shared';
import { upsertManySocials } from '@/server-actions/social';
import type { ProfileData } from '@/types/profile-data';

const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; placeholder: string; icon: React.ReactNode }
> = {
  github: {
    label: 'GitHub',
    placeholder: 'https://github.com/username',
    icon: <LinkIcon size={16} />
  },
  linkedin: {
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    icon: <Briefcase size={16} />
  },
  x: {
    label: 'X (Twitter)',
    placeholder: 'https://x.com/username',
    icon: <AtSign size={16} />
  },
  website: {
    label: 'Website',
    placeholder: 'https://yoursite.com',
    icon: <Globe size={16} />
  },
  email: {
    label: 'Email',
    placeholder: 'you@example.com',
    icon: <Mail size={16} />
  }
};

// Form is intentionally map-shaped (one input per platform) so the user can leave any
// platform blank without removing the row. The canonical `socialSchema` in
// schemas/social.ts is per-record; the server action validates each non-empty entry
// against it. The shared `httpUrl` validator (schemas/shared.ts) keeps the URL rules
// (https-only, empty allowed) in one place.
const socialsFormSchema = z.object({
  github: httpUrl,
  linkedin: httpUrl,
  x: httpUrl,
  website: httpUrl,
  email: z.union([z.literal(''), z.email()])
});

type SocialsFormValues = z.infer<typeof socialsFormSchema>;

type PreviewSeed = {
  profile: {
    displayName: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    availableForWork: boolean;
  } | null;
  projects: ProfileData['projects'];
  experiences: ProfileData['experiences'];
  skills: ProfileData['skills'];
};

type Props = {
  initialSocials: { platform: SocialPlatform; url: string }[];
  username: string;
  fallbackName: string;
  fallbackAvatar: string | null;
  previewSeed: PreviewSeed;
};

export function SocialsForm({
  initialSocials,
  username,
  fallbackName,
  fallbackAvatar,
  previewSeed
}: Props) {
  const [mode, setMode] = useState<PreviewMode>('edit');

  const existing = useMemo(
    () => Object.fromEntries(initialSocials.map(s => [s.platform, s.url])),
    [initialSocials]
  );

  const form = useForm<SocialsFormValues>({
    resolver: zodResolver(socialsFormSchema),
    defaultValues: Object.fromEntries(SOCIAL_PLATFORMS.map(p => [p, existing[p] ?? '']))
  });

  const {
    register,
    control,
    formState: { errors }
  } = form;

  const watched = useWatch({ control });

  const previewSocials: ProfileData['socials'] = SOCIAL_PLATFORMS.map(platform => ({
    platform,
    url: (watched[platform] ?? '').trim()
  })).filter(s => s.url.length > 0);

  const previewData: ProfileData = {
    username,
    displayName: previewSeed.profile?.displayName?.trim() || fallbackName || username,
    headline: previewSeed.profile?.headline ?? '',
    bio: previewSeed.profile?.bio ?? '',
    location: previewSeed.profile?.location ?? '',
    avatarUrl: previewSeed.profile?.avatarUrl?.trim() || fallbackAvatar || null,
    availableForWork: previewSeed.profile?.availableForWork ?? false,
    projects: previewSeed.projects,
    experiences: previewSeed.experiences,
    skills: previewSeed.skills,
    socials: previewSocials
  };

  const saveMutation = useMutation({
    mutationFn: (data: SocialsFormValues) => upsertManySocials(data),
    onSuccess: () => toast.success('Socials saved'),
    onError: err => toast.error(err.message)
  });

  const onSubmit = form.handleSubmit(data => saveMutation.mutate(data));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <PageTitle>Socials</PageTitle>
          <PageDescription>
            Leave blank to hide a platform. Changes apply to your public profile.
          </PageDescription>
        </div>
        <PreviewToggle mode={mode} onChange={setMode} />
      </div>

      {mode === 'preview' ? (
        <PublicProfile data={previewData} />
      ) : (
        <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
          {SOCIAL_PLATFORMS.map(platform => {
            const meta = PLATFORM_META[platform];
            const error = errors[platform];
            return (
              <div key={platform} className="flex flex-col gap-1.5">
                <Label htmlFor={`social-${platform}`} className="flex items-center gap-2">
                  <span className="text-ink-3">{meta.icon}</span>
                  {meta.label}
                </Label>
                <Input
                  id={`social-${platform}`}
                  type={platform === 'email' ? 'email' : 'url'}
                  placeholder={meta.placeholder}
                  {...register(platform)}
                />
                <FormError>{error?.message}</FormError>
              </div>
            );
          })}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save socials'}
            </Button>
            <FormError className="text-sm">{saveMutation.error?.message}</FormError>
          </div>
        </form>
      )}
    </div>
  );
}
