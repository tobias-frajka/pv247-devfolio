'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { PreviewToggle, type PreviewMode } from '@/components/dashboard/preview-toggle';
import { PublicProfile } from '@/components/public-profile/public-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { PageTitle } from '@/components/ui/page-title';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { createExperience, deleteExperience, updateExperience } from '@/server-actions/experience';
import type { ProfileData } from '@/types/profile-data';

type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
};

type SaveData = {
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
};

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
  skills: ProfileData['skills'];
  socials: ProfileData['socials'];
};

type Props = {
  experiences: Experience[];
  username: string;
  fallbackName: string;
  fallbackAvatar: string | null;
  previewSeed: PreviewSeed;
};

// Form-side schema. The canonical server-side schema is `experienceSchema` in
// schemas/experience.ts; we diverge only in (1) date fields typed as `<input type="date">`
// strings instead of Date objects, and (2) a UI-only `currentlyWorking` checkbox that
// gates the end-date input. The handler at onSubmit converts back to ExperienceInput.
const formSchema = z
  .object({
    company: z.string().min(1, 'Required').max(120),
    role: z.string().min(1, 'Required').max(120),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string(),
    currentlyWorking: z.boolean(),
    description: z.string().max(2000).optional().or(z.literal(''))
  })
  .refine(v => v.currentlyWorking || !!v.endDate, {
    path: ['endDate'],
    message: 'End date is required'
  })
  .refine(v => v.currentlyWorking || !v.endDate || v.endDate >= v.startDate, {
    path: ['endDate'],
    message: 'End date must be after start date'
  });

type FormValues = z.infer<typeof formSchema>;

function toDateString(d: Date | null | undefined) {
  if (!d) return '';
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatRange(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(start)} — ${end ? fmt(end) : 'Present'}`;
}

function ExperienceDialogForm({
  initial,
  onSave,
  onCancel,
  isPending,
  error
}: {
  initial: Experience | null;
  onSave: (data: SaveData) => void;
  onCancel: () => void;
  isPending: boolean;
  error: Error | null;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: initial?.company ?? '',
      role: initial?.role ?? '',
      startDate: toDateString(initial?.startDate),
      endDate: toDateString(initial?.endDate),
      currentlyWorking: !initial?.endDate,
      description: initial?.description ?? ''
    }
  });

  const {
    register,
    setValue,
    control,
    formState: { errors }
  } = form;
  const currentlyWorking = useWatch({ control, name: 'currentlyWorking' });
  const cw = register('currentlyWorking');

  const onSubmit = form.handleSubmit(data => {
    onSave({
      company: data.company,
      role: data.role,
      startDate: fromDateString(data.startDate),
      endDate: data.currentlyWorking ? null : data.endDate ? fromDateString(data.endDate) : null,
      description: data.description
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-company">Company</Label>
          <Input id="exp-company" placeholder="Acme Corp" {...register('company')} />
          <FormError>{errors.company?.message}</FormError>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-role">Role</Label>
          <Input id="exp-role" placeholder="Software Engineer" {...register('role')} />
          <FormError>{errors.role?.message}</FormError>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-start">Start date</Label>
          <Input id="exp-start" type="date" {...register('startDate')} />
          <FormError>{errors.startDate?.message}</FormError>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-end">End date</Label>
          <Input id="exp-end" type="date" disabled={currentlyWorking} {...register('endDate')} />
          <FormError>{errors.endDate?.message}</FormError>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="border-input accent-primary h-4 w-4 rounded"
          {...cw}
          onChange={e => {
            cw.onChange(e);
            if (e.target.checked) setValue('endDate', '');
          }}
        />
        Currently working here
      </label>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="exp-desc">Description</Label>
        <Textarea
          id="exp-desc"
          rows={3}
          placeholder="What did you work on? (optional)"
          {...register('description')}
        />
        <FormError>{errors.description?.message}</FormError>
      </div>

      <FormError className="text-sm">{error?.message}</FormError>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : initial ? 'Update' : 'Add experience'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ExperienceClient({
  experiences,
  username,
  fallbackName,
  fallbackAvatar,
  previewSeed
}: Props) {
  const [mode, setMode] = useState<PreviewMode>('edit');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  const previewData: ProfileData = {
    username,
    displayName: previewSeed.profile?.displayName?.trim() || fallbackName || username,
    headline: previewSeed.profile?.headline ?? '',
    bio: previewSeed.profile?.bio ?? '',
    location: previewSeed.profile?.location ?? '',
    avatarUrl: previewSeed.profile?.avatarUrl?.trim() || fallbackAvatar || null,
    availableForWork: previewSeed.profile?.availableForWork ?? false,
    projects: previewSeed.projects,
    experiences,
    skills: previewSeed.skills,
    socials: previewSeed.socials
  };

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => toast.success('Experience deleted'),
    onError: err => toast.error(err.message)
  });

  const saveMutation = useMutation({
    mutationFn: async ({ editingId, data }: { editingId: string | null; data: SaveData }) => {
      if (editingId) {
        await updateExperience(editingId, data);
      } else {
        await createExperience(data);
      }
    },
    onSuccess: (_, vars) => {
      toast.success(vars.editingId ? 'Experience updated' : 'Experience added');
      setDialogOpen(false);
    },
    onError: err => toast.error(err.message)
  });

  const openAdd = () => {
    saveMutation.reset();
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (e: Experience) => {
    saveMutation.reset();
    setEditing(e);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) saveMutation.reset();
    setDialogOpen(open);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageTitle>Experience</PageTitle>
        <div className="flex gap-2">
          <PreviewToggle mode={mode} onChange={setMode} />
          {mode === 'edit' && (
            <Button size="sm" onClick={openAdd}>
              Add experience
            </Button>
          )}
        </div>
      </div>

      {mode === 'edit' ? (
        experiences.length === 0 ? (
          <div className="border-hairline text-ink-3 rounded-lg border border-dashed p-10 text-center">
            <p className="m-0 text-sm">No experience yet. Add your first role.</p>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {experiences.map(exp => (
              <li
                key={exp.id}
                className="border-hairline-soft bg-paper-2 flex items-start justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="m-0 text-sm font-medium">{exp.role}</p>
                  <p className="text-ink-2 m-0 text-sm">{exp.company}</p>
                  <p className="text-ink-3 m-0 text-xs">
                    {formatRange(exp.startDate, exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="text-ink-2 m-0 mt-1 line-clamp-2 text-xs">{exp.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit experience"
                    onClick={() => openEdit(exp)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete experience"
                    disabled={deleteMutation.isPending && deleteMutation.variables === exp.id}
                    onClick={() => deleteMutation.mutate(exp.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <PublicProfile data={previewData} />
      )}

      <DialogRoot open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit experience' : 'Add experience'}</DialogTitle>
            <DialogDescription>A job, internship, or freelance role.</DialogDescription>
          </DialogHeader>
          <ExperienceDialogForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSave={data => saveMutation.mutate({ editingId: editing?.id ?? null, data })}
            onCancel={() => handleDialogOpenChange(false)}
            isPending={saveMutation.isPending}
            error={saveMutation.error}
          />
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
