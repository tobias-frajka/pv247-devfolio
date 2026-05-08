'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, Briefcase, Globe, Mail, AtSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/db/schema/social';
import { removeSocial, upsertSocial } from '@/server-actions/social';

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

const socialsFormSchema = z.object({
  github: z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  x: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal(''))
});

type SocialsFormValues = z.infer<typeof socialsFormSchema>;

type Props = {
  initialSocials: { platform: SocialPlatform; url: string }[];
};

export function SocialsForm({ initialSocials }: Props) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const existing = Object.fromEntries(initialSocials.map(s => [s.platform, s.url]));

  const form = useForm<SocialsFormValues>({
    resolver: zodResolver(socialsFormSchema),
    defaultValues: Object.fromEntries(SOCIAL_PLATFORMS.map(p => [p, existing[p] ?? '']))
  });

  const {
    register,
    formState: { errors }
  } = form;

  const onSubmit = form.handleSubmit(data => {
    startTransition(async () => {
      try {
        await Promise.all(
          SOCIAL_PLATFORMS.map(async platform => {
            const url = data[platform] ?? '';
            if (url) {
              await upsertSocial({ platform, url });
            } else if (existing[platform]) {
              await removeSocial(platform);
            }
          })
        );
        setSaved(true);
        setSaveError(null);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Failed to save');
      }
    });
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Socials
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
          Leave blank to hide a platform. Changes apply to your public profile.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
        {SOCIAL_PLATFORMS.map(platform => {
          const meta = PLATFORM_META[platform];
          const error = errors[platform];
          return (
            <div key={platform} className="flex flex-col gap-1.5">
              <Label htmlFor={`social-${platform}`} className="flex items-center gap-2">
                <span className="text-[var(--ink-3)]">{meta.icon}</span>
                {meta.label}
              </Label>
              <Input
                id={`social-${platform}`}
                type={platform === 'email' ? 'email' : 'url'}
                placeholder={meta.placeholder}
                {...register(platform)}
              />
              {error && (
                <p className="text-xs" style={{ color: 'var(--danger)' }}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save socials'}
          </Button>
          {saved && (
            <span className="text-sm" style={{ color: 'var(--ok)' }}>
              Saved
            </span>
          )}
          {saveError && (
            <span className="text-sm" style={{ color: 'var(--danger)' }}>
              {saveError}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
