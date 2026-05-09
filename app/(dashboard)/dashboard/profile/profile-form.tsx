'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/ui/form-error';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import type { SkillCategory } from '@/db/schema/skill';
import { profileSchema, type ProfileInput } from '@/schemas/profile';
import { generateBio, suggestTitles } from '@/server-actions/ai';
import { upsertProfile } from '@/server-actions/profile';

type Props = {
  initialProfile: {
    displayName: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    availableForWork: boolean;
  } | null;
  skills: { name: string; category: SkillCategory }[];
};

export function ProfileForm({ initialProfile, skills }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
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

  const saveMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: () => {
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  });

  const generateBioMutation = useMutation({
    mutationFn: generateBio,
    onSuccess: bio => {
      setValue('bio', bio ?? '');
      setBioDialogOpen(false);
    }
  });

  const suggestTitlesMutation = useMutation({
    mutationFn: suggestTitles,
    onSuccess: titles => setSuggestedTitles(titles ?? [])
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

  return (
    <>
      <DialogRoot open={bioDialogOpen} onOpenChange={setBioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate bio</DialogTitle>
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
              <FormError className="text-sm">AI unavailable — try again in a moment</FormError>
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
                  className="rounded-md border border-[var(--hairline)] bg-[var(--paper-2)] px-2 py-0.5 text-xs transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
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
                disabled={generateBioMutation.isPending}
              >
                Improve with AI
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleOpenGenerateBio}
                disabled={generateBioMutation.isPending}
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
          {generateBioMutation.isPending && (
            <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
              Generating…
            </p>
          )}
          {generateBioMutation.isError && (
            <FormError>AI unavailable — try again in a moment</FormError>
          )}
          <FormError>{errors.bio?.message}</FormError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Prague, CZ" {...register('location')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            type="url"
            placeholder="https://github.com/you.png"
            {...register('avatarUrl')}
          />
          <FormError>{errors.avatarUrl?.message}</FormError>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] px-4 py-3">
          <div>
            <p className="m-0 text-sm font-medium">Available for work</p>
            <p className="m-0 text-xs" style={{ color: 'var(--ink-2)' }}>
              Shows a badge on your public profile
            </p>
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
          {saved && (
            <span className="text-sm" style={{ color: 'var(--ok)' }}>
              Saved
            </span>
          )}
          <FormError className="text-sm">{saveMutation.error?.message}</FormError>
        </div>
      </form>
    </>
  );
}
