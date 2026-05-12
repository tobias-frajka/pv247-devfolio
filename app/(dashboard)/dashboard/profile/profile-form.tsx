'use client';

import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { PreviewToggle, type PreviewMode } from '@/components/dashboard/preview-toggle';
import { PublicProfile } from '@/components/public-profile/public-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/ui/form-error';
import { PageDescription, PageTitle } from '@/components/ui/page-title';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import type { SkillCategory } from '@/db/schema/skill';
import { profileSchema, type ProfileInput } from '@/schemas/profile';
import { generateBio, suggestTitles } from '@/server-actions/ai';
import { upsertProfile } from '@/server-actions/profile';
import type { ProfileData } from '@/types/profile-data';

type Props = {
  initialProfile: {
    displayName: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    availableForWork: boolean;
  } | null;
  username: string;
  fallbackName: string;
  fallbackAvatar: string | null;
  skills: { name: string; category: SkillCategory }[];
  otherSections: {
    projects: ProfileData['projects'];
    experiences: ProfileData['experiences'];
    skills: ProfileData['skills'];
    socials: ProfileData['socials'];
  };
};

export function ProfileForm({
  initialProfile,
  username,
  fallbackName,
  fallbackAvatar,
  skills,
  otherSections
}: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<PreviewMode>('edit');
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [bioRole, setBioRole] = useState('');
  const [bioYears, setBioYears] = useState(3);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: initialProfile?.displayName ?? '',
      headline: initialProfile?.headline ?? '',
      bio: initialProfile?.bio ?? '',
      location: initialProfile?.location ?? '',
      avatarUrl: initialProfile?.avatarUrl ?? '',
      availableForWork: initialProfile?.availableForWork ?? false
    }
  });

  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors }
  } = form;

  const watched = useWatch({ control });

  const previewData: ProfileData = {
    username,
    displayName: watched.displayName?.trim() || fallbackName || username,
    headline: watched.headline ?? '',
    bio: watched.bio ?? '',
    location: watched.location ?? '',
    avatarUrl: watched.avatarUrl?.trim() || fallbackAvatar || null,
    availableForWork: watched.availableForWork ?? false,
    projects: otherSections.projects,
    experiences: otherSections.experiences,
    skills: otherSections.skills,
    socials: otherSections.socials
  };

  const saveMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: () => toast.success('Profile saved'),
    onError: err => toast.error(err.message)
  });

  // AI mutations: revalidatePath in the action invalidates the server cache, but
  // useMutation does not auto-refetch the way useActionState does — router.refresh()
  // is what causes the sidebar AiUsageCard (an RSC in the dashboard layout) to
  // re-render with the bumped quota.
  const generateBioMutation = useMutation({
    mutationFn: generateBio,
    onSuccess: bio => {
      setValue('bio', bio ?? '');
      setBioDialogOpen(false);
      router.refresh();
      toast.success('Bio generated');
    },
    onError: err => toast.error(err.message)
  });

  const suggestTitlesMutation = useMutation({
    mutationFn: suggestTitles,
    onSuccess: titles => {
      setSuggestedTitles(titles ?? []);
      router.refresh();
      toast.success('Titles suggested');
    },
    onError: err => toast.error(err.message)
  });

  const onSubmit = form.handleSubmit(data => saveMutation.mutate(data));

  const handleOpenGenerateBio = () => {
    setBioRole(getValues('headline') ?? '');
    setBioDialogOpen(true);
  };

  const handleGenerateBioSubmit = () => {
    generateBioMutation.mutate({
      role: bioRole || 'Developer',
      yearsExperience: bioYears,
      topSkills: skills.slice(0, 3).map(s => s.name)
    });
  };

  const handleImproveBio = () => {
    generateBioMutation.mutate({
      role: getValues('headline') || 'Developer',
      yearsExperience: 3,
      topSkills: skills.slice(0, 3).map(s => s.name)
    });
  };

  const handleSuggestTitles = () => {
    suggestTitlesMutation.mutate({
      skills: skills.map(s => ({ name: s.name, category: s.category }))
    });
  };

  const noSkills = skills.length === 0;

  return (
    <>
      <DialogRoot open={bioDialogOpen} onOpenChange={setBioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate bio</DialogTitle>
            <DialogDescription>
              Tell us your role and years of experience — we&apos;ll draft a bio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio-role">Your role</Label>
              <Input
                id="bio-role"
                value={bioRole}
                onChange={e => setBioRole(e.target.value)}
                placeholder="e.g. Full-stack Developer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio-years">Years of experience</Label>
              <Input
                id="bio-years"
                type="number"
                min={0}
                max={50}
                value={bioYears}
                onChange={e => setBioYears(Number(e.target.value))}
              />
            </div>
            {generateBioMutation.isError && (
              <FormError className="text-sm">{generateBioMutation.error.message}</FormError>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setBioDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerateBioSubmit}
              disabled={generateBioMutation.isPending}
            >
              {generateBioMutation.isPending ? 'Generating…' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <PageTitle>Profile</PageTitle>
            <PageDescription>
              This shows on your public page at <span className="font-mono">/{username}</span>
            </PageDescription>
          </div>
          <PreviewToggle mode={mode} onChange={setMode} />
        </div>

        {mode === 'edit' ? (
          <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" placeholder="Jane Smith" {...register('displayName')} />
              <FormError>{errors.displayName?.message}</FormError>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="headline">Headline</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleSuggestTitles}
                  disabled={suggestTitlesMutation.isPending || !skills.length}
                >
                  {suggestTitlesMutation.isPending ? 'Thinking…' : 'Suggest titles'}
                </Button>
              </div>
              {suggestedTitles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTitles.map(title => (
                    <button
                      key={title}
                      type="button"
                      className="border-hairline bg-paper-2 hover:border-brand hover:text-brand rounded-md border px-2 py-0.5 text-xs transition-colors"
                      onClick={() => {
                        setValue('headline', title);
                        setSuggestedTitles([]);
                      }}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
              <Input id="headline" placeholder="Full-stack Developer" {...register('headline')} />
              {suggestTitlesMutation.isError && (
                <FormError>{suggestTitlesMutation.error.message}</FormError>
              )}
              <FormError>{errors.headline?.message}</FormError>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleImproveBio}
                    disabled={generateBioMutation.isPending || noSkills}
                  >
                    Improve with AI
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleOpenGenerateBio}
                    disabled={generateBioMutation.isPending || noSkills}
                  >
                    Generate from scratch
                  </Button>
                </div>
              </div>
              <Textarea
                id="bio"
                rows={5}
                placeholder="A short bio about yourself…"
                className={generateBioMutation.isPending ? 'opacity-60' : ''}
                {...register('bio')}
              />
              {noSkills && (
                <p className="text-ink-3 m-0 text-xs">
                  Add skills first —{' '}
                  <Link href="/dashboard/skills" className="underline">
                    go to Skills
                  </Link>
                </p>
              )}
              {generateBioMutation.isPending && <p className="text-ink-3 text-xs">Generating…</p>}
              {generateBioMutation.isError && (
                <FormError>{generateBioMutation.error.message}</FormError>
              )}
              <FormError>{errors.bio?.message}</FormError>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Prague, CZ" {...register('location')} />
            </div>

            <div id="avatar" className="flex scroll-mt-6 flex-col gap-1.5">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://github.com/you.png"
                {...register('avatarUrl')}
              />
              <FormError>{errors.avatarUrl?.message}</FormError>
            </div>

            <div className="border-hairline-soft bg-paper-2 flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="m-0 text-sm font-medium">Available for work</p>
                <p className="text-ink-2 m-0 text-xs">Shows a badge on your public profile</p>
              </div>
              <Controller
                control={control}
                name="availableForWork"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : 'Save profile'}
              </Button>
              <FormError className="text-sm">{saveMutation.error?.message}</FormError>
            </div>
          </form>
        ) : (
          <PublicProfile data={previewData} />
        )}
      </div>
    </>
  );
}
